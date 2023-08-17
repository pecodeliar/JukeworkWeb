from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.urls import reverse
from django import forms
from .models import User
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from django.http import JsonResponse


# Create your views here.
def login_view(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse("common:index"))
    else:
        return render(request, "users/auth.html", {
            "page": "Login"
        })


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("core:index"))


def register(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse("common:index"))
    else:
        return render(request, "users/auth.html", {
            "page": "Register"
        })