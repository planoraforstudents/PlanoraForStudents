from django.urls import path
from . import views


urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('verify-otp/', views.verify_otp, name='verify-otp'),
    path('login/', views.login_user, name='login'),
    path('profile/', views.get_user_profile, name='user-profile'),
    path('resend-otp/', views.resend_otp, name='resend_otp'),
    path("request-password-reset/", views.request_password_reset,
         name="request_password_reset"),
    path("verify-reset-otp/", views.verify_reset_otp, name="verify_reset_otp"),
    path("reset-password/", views.reset_password, name="reset_password"),
]
