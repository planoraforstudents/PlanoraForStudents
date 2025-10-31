from datetime import timedelta
import random
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from django.db import IntegrityError
from django.contrib.auth.models import BaseUserManager
from django.contrib.auth import authenticate, get_user_model
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import CustomUser, OTPVerification
from .serializers import UserSerializer

User = get_user_model()

# ---------------- REGISTER USER ----------------


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    email = request.data.get("email")
    username = request.data.get("username")
    password = request.data.get("password")

    if not email or not username or not password:
        return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

    # --- FIX 1: NORMALIZE INPUTS ---
    try:
        # Normalize email and username to lowercase/standard format
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
# Replace your verify_otp with this (dev-friendly, robust)
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    email = request.data.get("email")
    otp_in = request.data.get("otp")

    if not email or otp_in is None:
        return Response({"message": "Email and OTP are required"}, status=status.HTTP_400_BAD_REQUEST)

    # Normalize incoming values
    try:
        email = BaseUserManager.normalize_email(email).lower().strip()
    except Exception:
        return Response({"message": "Invalid email"}, status=status.HTTP_400_BAD_REQUEST)

    # Make otp a trimmed string
    otp = str(otp_in).strip()

    # Find unused OTPs for this email (case-insensitive)
    otp_qs = OTPVerification.objects.filter(email__iexact=email)
    if not otp_qs.exists():
        return Response({"message": "Invalid OTP or email"}, status=status.HTTP_400_BAD_REQUEST)

    # Prefer the latest unused OTP record
    try:
        otp_record = otp_qs.filter(
            is_used=False).order_by('-created_at').first()
    except Exception:
        otp_record = None

    if not otp_record:
        return Response({"message": "Invalid OTP or it has been used"}, status=status.HTTP_400_BAD_REQUEST)

    # Compare values in a forgiving way (string compare)
    if str(otp_record.otp).strip() != otp:
        return Response({"message": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

    # Check expiry (assuming model has is_expired method)
    if hasattr(otp_record, "is_expired") and otp_record.is_expired():
        otp_record.delete()
        return Response({"message": "OTP expired, please request a new one"}, status=status.HTTP_400_BAD_REQUEST)

    # Find the user and activate
    try:
        user = CustomUser.objects.get(email__iexact=email, is_active=False)
    except CustomUser.DoesNotExist:
        return Response({"message": "User not found or already verified"}, status=status.HTTP_400_BAD_REQUEST)

    user.is_active = True
    user.is_verified = True
    user.save()

    # Mark used or delete record
    try:
        # If your model has is_used field, mark it; otherwise delete.
        if hasattr(otp_record, "is_used"):
            otp_record.is_used = True
            otp_record.save()
        else:
            otp_record.delete()
    except Exception:
        otp_record.delete()

    return Response({"message": "Registration successful!"}, status=status.HTTP_201_CREATED)


# ---------------- LOGIN USER ----------------
@api_view(["POST"])
@permission_classes([AllowAny])
def login_user(request):
    """
    Handles user login using either email or username.
    Returns JWT access and refresh tokens if authentication succeeds.
    """
    identifier = request.data.get("identifier")
    password = request.data.get("password")

    # Validate input
    if not identifier or not password:
        return Response(
            {"error": "Identifier and password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Find the user by email or username
    User = get_user_model()
    try:
        if "@" in identifier:
            user_obj = User.objects.get(email__iexact=identifier.strip())
        else:
            user_obj = User.objects.get(username__iexact=identifier.strip())
    except User.DoesNotExist:
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Authenticate using username (Django default)
    user = authenticate(request, username=user_obj.email, password=password)
    if not isinstance(user, CustomUser):
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

    if user is None:
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Account state checks
    if not user.is_active:
        return Response(
            {"error": "Account not active. Please verify your OTP first."},
            status=status.HTTP_403_FORBIDDEN,
        )

    if getattr(user, "is_verified", False) is False:
        return Response(
            {"error": "Account not verified. Please complete OTP verification."},
            status=status.HTTP_403_FORBIDDEN,
        )

    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    return Response(
        {
            "refresh": refresh_token,
            "access": access_token,
            "message": "Login successful",
            "user": {
                "id": getattr(user, "id", None),  # ✅ safe for type checker
                "username": user.username,
                "email": user.email,
            },
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def resend_otp(request):
    email = request.data.get("email")

    if not email:
        return Response({"message": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = CustomUser.objects.get(email__iexact=email)
    except CustomUser.DoesNotExist:
        return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # delete old OTPs for this email
    OTPVerification.objects.filter(email__iexact=email).delete()

    # generate new OTP
    otp = str(random.randint(100000, 999999))
    OTPVerification.objects.create(
        email=email, otp=otp, is_used=False, created_at=timezone.now())

    # send mail
    send_mail(
        "Your new OTP Code",
        f"Your new verification code is {otp}. It is valid for 5 minutes.",
        "no-reply@planora.com",
        [email],
        fail_silently=False,
    )

    return Response({"message": "New OTP sent successfully"}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def request_password_reset(request):
    email = request.data.get("email")

    if not email:
        return Response({"message": "Email is required"}, status=400)

    try:
        user = CustomUser.objects.get(email__iexact=email)
    except CustomUser.DoesNotExist:
        return Response({"message": "No account found with that email."}, status=404)

    # Delete old OTPs
    OTPVerification.objects.filter(email__iexact=email).delete()

    otp = str(random.randint(100000, 999999))
    OTPVerification.objects.create(
        email=email, otp=otp, is_used=False, created_at=timezone.now())

    send_mail(
        "Planora Password Reset OTP",
        f"Your OTP for password reset is {otp}. It will expire in 5 minutes.",
        "no-reply@planora.com",
        [email],
        fail_silently=False,
    )

    return Response({"message": "Password reset OTP sent to your email."}, status=200)


# 2️⃣ Verify reset OTP
@api_view(["POST"])
@permission_classes([AllowAny])
def verify_reset_otp(request):
    email = request.data.get("email")
    otp = request.data.get("otp")

    if not email or not otp:
        return Response({"message": "Email and OTP are required."}, status=400)

    try:
        record = OTPVerification.objects.get(
            email__iexact=email, otp=otp, is_used=False)
    except OTPVerification.DoesNotExist:
        return Response({"message": "Invalid or expired OTP."}, status=400)

    if hasattr(record, "is_expired") and record.is_expired():
        record.delete()
        return Response({"message": "OTP expired. Please request a new one."}, status=400)

    record.is_used = True
    record.save()

    return Response({"message": "OTP verified successfully."}, status=200)


# 3️⃣ Reset password
@api_view(["POST"])
@permission_classes([AllowAny])
def reset_password(request):
    email = request.data.get("email")
    new_password = request.data.get("new_password")

    if not email or not new_password:
        return Response({"message": "Email and new password required."}, status=400)

    try:
        user = CustomUser.objects.get(email__iexact=email)
    except CustomUser.DoesNotExist:
        return Response({"message": "User not found."}, status=404)

    user.set_password(new_password)
    user.save()

    return Response({"message": "Password reset successfully."}, status=200)


# ---------------- GET CURRENT USER (for frontend) ----------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)
