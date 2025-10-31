import random
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from .models import CustomUser, OTPVerification
from .serializers import UserSerializer
from django.db import IntegrityError
from django.contrib.auth.models import BaseUserManager


# ---------------- REGISTER USER ----------------
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    email = request.data.get("email")
    username = request.data.get("username")
    password = request.data.get("password")

    if not email or not username or not password:
        return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

    # Normalize inputs
    try:
        email = BaseUserManager.normalize_email(email).lower()
        username = username.strip().lower()
    except Exception as e:
        return Response({"error": "Invalid email or username"}, status=status.HTTP_400_BAD_REQUEST)

    # Check for existing *active* users
    if CustomUser.objects.filter(email=email, is_active=True).exists():
        return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

    if CustomUser.objects.filter(username=username, is_active=True).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Get or create an inactive user
        user, created = CustomUser.objects.get_or_create(
            email=email,
            defaults={'username': username, 'is_active': False}
        )

        # If user existed (was inactive), update their username and password
        if not created:
            # Check if the new username conflicts with *another* user
            if CustomUser.objects.filter(username=username).exclude(email=email).exists():
                return Response({"error": "Username is already taken"}, status=status.HTTP_400_BAD_REQUEST)
            user.username = username

        user.set_password(password)
        user.is_active = False  # Ensure user is inactive
        user.save()

    except IntegrityError:
        # This catches if the username in 'defaults' was already taken
        return Response({"error": "Username is already taken"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # --- OTP Logic ---
    otp = str(random.randint(100000, 999999))

    # Delete any old, unused OTPs for this email
    OTPVerification.objects.filter(email=email).delete()

    # Create new OTP record in the database
    OTPVerification.objects.create(email=email, otp=otp)

    # Send OTP via email
    try:
        send_mail(
            "Your OTP Code",
            f"Your verification code is {otp}. It is valid for 10 minutes.",
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
    except Exception as e:
        # If email fails, roll back user creation so they can try again
        user.delete()
        OTPVerification.objects.filter(email=email).delete()  # Clean up OTP
        return Response({"error": f"Failed to send verification email. Please try again."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({"message": "OTP sent successfully to email"})


# ---------------- VERIFY OTP ----------------
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    email = request.data.get("email")
    otp = str(request.data.get("otp")).strip()

    if not email or not otp:
        return Response({"message": "Email and OTP are required"}, status=status.HTTP_400_BAD_REQUEST)

    # Normalize email for lookup
    try:
        email = BaseUserManager.normalize_email(email).lower()
    except Exception:
        return Response({"message": "Invalid email"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Find the OTP in the database
        otp_record = OTPVerification.objects.get(
            email=email, otp=otp, is_used=False)
    except OTPVerification.DoesNotExist:
        return Response({"message": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

    # Check if OTP is expired
    if otp_record.is_expired():
        otp_record.delete()
        return Response({"message": "OTP expired, please request a new one"}, status=status.HTTP_400_BAD_REQUEST)

    # Find the associated user
    try:
        user = CustomUser.objects.get(email=email, is_active=False)
    except CustomUser.DoesNotExist:
        return Response({"message": "User not found or already verified"}, status=status.HTTP_400_BAD_REQUEST)

    # Activate the user
    user.is_active = True
    user.is_verified = True
    user.save()

    # Clean up the used OTP
    otp_record.delete()

    return Response({"message": "Registration successful!"}, status=status.HTTP_201_CREATED)


# ---------------- LOGIN USER ----------------
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    identifier = request.data.get("identifier")
    password = request.data.get("password")

    if not identifier or not password:
        return Response({"error": "Identifier and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    # Normalize identifier
    identifier = identifier.strip()
    username_to_auth = ""

    if "@" in identifier:
        try:
            normalized_email = BaseUserManager.normalize_email(
                identifier).lower()
            user_obj = CustomUser.objects.get(email=normalized_email)
            username_to_auth = user_obj.username
        except CustomUser.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        username_to_auth = identifier.lower()

    user = authenticate(username=username_to_auth, password=password)

    if user is None:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

    if not user.is_active:
        return Response({"error": "User not verified. Please verify your email first."}, status=status.HTTP_403_FORBIDDEN)

    refresh = RefreshToken.for_user(user)
    return Response({
        "message": "Login successful",
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": UserSerializer(user).data
    })


# ---------------- GET CURRENT USER (for frontend) ----------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)
