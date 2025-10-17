from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from .forms import LoginForm
from django.contrib import messages


def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']

            user = authenticate(request, email=email, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, 'Login successful.')
                return redirect(Dashboard)
            else:
                messages.error(request, 'Invalid email or password.')
        else:
            messages.error(request, 'Please correct the error below.')
    else:
        form = LoginForm()
    return render(request, 'login/Login.html', {'form': form})
