from django.shortcuts import render
from .forms import RegistrationForm
from django.contrib import messages


def register_view(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(
                request, 'Registration successful. You can now log in.')
            return render(request, 'Login.html')
        else:
            messages.error(request, 'Please correct the error below.')
    else:
        form = RegistrationForm()

        return render(request, 'register/Register.html', {'form': form})
