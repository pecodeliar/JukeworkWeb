from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.urls import reverse
from django import forms
from .models import User
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError


# https://ordinarycoders.com/blog/article/django-user-register-login-logout
class NewUserForm(UserCreationForm):
    email = forms.EmailField(required=True, widget=forms.TextInput(attrs={'placeholder': 'Enter your email'}))

    class Meta:
        model = User
        fields = ("username", "email", "first_name", "password1", "password2")
        widgets = {
            'username': forms.TextInput(attrs={'placeholder': 'Enter a username'}),
            'first_name': forms.TextInput(attrs={'placeholder': 'Enter your name'})
        }

    def clean_email(self):
        email = self.cleaned_data['email']
        if email != "partylike@rock.star":
            raise ValidationError("You cannot be registered with this email.")
        return email


# Create your views here.
def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            print("good")
            return HttpResponseRedirect(reverse("core:index"))
        else:
            print("failed")
            return render(request, "users/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "users/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("core:index"))


def register(request):
    if request.method == "POST":

        form = NewUserForm(request.POST)

        if form.is_valid():
            user = form.save()
            username = form.cleaned_data["username"]
            email = form.cleaned_data["email"]
            first_name = form.cleaned_data["first_name"]
            password = request.POST["password1"]
            confirmation = request.POST["password2"]

            # Attempt to create new user
            try:
                user = User.objects.create_user(username, email, password, first_name=first_name)
                user.save()
            except IntegrityError:
                return render(request, "users/register.html", {
                    "message": "Username already taken."
                })
            login(request, user)
            return HttpResponseRedirect(reverse("core:index"))
        else:
            print(form.errors.as_json())
            return render(request, "users/register.html", {
                    "message": form.errors,
                    "form_fields": list(NewUserForm())
                })
    else:
        return render(request, "users/register.html", {
            "form_fields": list(NewUserForm())
        })