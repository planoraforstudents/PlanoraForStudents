# Make sure you import 'redirect'
from django.shortcuts import render, redirect
from .forms import RegistrationForm
from django.contrib import messages


def register_view(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(
                request, 'Registration successful. You can now log in.')
            return redirect('login')
        else:
            messages.error(request, 'Please correct the error below.')
            return render(request, 'register/Register.html', {'form': form})
    else:
        # This part was already correct
        form = RegistrationForm()
        return render(request, 'register/Register.html', {'form': form})