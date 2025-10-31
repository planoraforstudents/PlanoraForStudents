from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers


User = get_user_model()



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.USERNAME_FIELD  # keep compatibility

    def validate(self, attrs):
        identifier = attrs.get("username")
        password = attrs.get("password")

        user = None
        if identifier and "@" in identifier:
            try:
                user_obj = User.objects.get(email=identifier)
                user = authenticate(
                    username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass
        else:
            user = authenticate(username=identifier, password=password)

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        refresh = self.get_token(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),  # type: ignore[attr-defined]
            "user": {
                "id": user.id,  # type: ignore[attr-defined]
                "username": user.username,
                "email": user.email,
            },
        }


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_active",
            "date_joined",
        ]
