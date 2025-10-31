from datetime import timedelta
import random
from time import timezone
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import timedelta
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser
from .serializers import UserSerializer


# Temporary in-memory OTP store (you can move this to a model later)
otp_storage = {}


# ---------------- REGISTER USER ----------------
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    email = request.data.get("email")
    username = request.data.get("username")
    password = request.data.get("password")

    if not email or not username or not password:
        return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

    if CustomUser.objects.filter(email=email).exists():
        return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

    otp = str(random.randint(100000, 999999))
    otp_storage[email] = {"otp": otp,
                          "username": username, "password": password}

    # Send OTP via email
    send_mail(
        "Your OTP Code",
        f"Your verification code is {otp}",
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False,
    )

    return Response({"message": "OTP sent successfully to email"})


# ---------------- VERIFY OTP ----------------
@api_view(['POST'])
def verify_otp(request):
    email = request.data.get("email")
    otp = str(request.data.get("otp")).strip()

    if not email or not otp:
        return Response({"message": "Email and OTP are required"}, status=status.HTTP_400_BAD_REQUEST)

    # Check OTP existence
    if email not in otp_storage:
        return Response({"message": "OTP expired or not found"}, status=status.HTTP_400_BAD_REQUEST)

    stored_data = otp_storage[email]
    stored_otp = str(stored_data.get("otp")).strip()
    created_time = stored_data.get("created_at")

    # Expire OTP after 5 minutes
    if timezone.now() - created_time > timedelta(minutes=5):
        del otp_storage[email]
        return Response({"message": "OTP expired, please request a new one"}, status=status.HTTP_400_BAD_REQUEST)

    # Verify OTP match
    if otp != stored_otp:
        return Response({"message": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

    username = stored_data.get("username")
    password = stored_data.get("password")

    if not (username and password):
        return Response({"message": "Incomplete registration data"}, status=status.HTTP_400_BAD_REQUEST)

    # Check duplicate user
    if CustomUser.objects.filter(email=email).exists():
        del otp_storage[email]
        return Response({"message": "User already verified"}, status=status.HTTP_200_OK)

    user = CustomUser.objects.create_user(  # type: ignore
        username=username, email=email, password=password)
    user.is_active = True
    user.save()

    del otp_storage[email]
    return Response({"message": "Registration successful!"}, status=status.HTTP_201_CREATED)


# ---------------- LOGIN USER ----------------
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    identifier = request.data.get("identifier")
    password = request.data.get("password")

    if not identifier or not password:
        return Response({"error": "Identifier and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    # Allow login with either email or username
    if "@" in identifier:
        try:
            user_obj = CustomUser.objects.get(email=identifier)
            username = user_obj.username
        except CustomUser.DoesNotExist:
            return Response({"error": "User with this email does not exist"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        username = identifier

    user = authenticate(username=username, password=password)
    if user is None:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

    if not user.is_active:
        return Response({"error": "User not verified. Please verify OTP first."}, status=status.HTTP_403_FORBIDDEN)

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
