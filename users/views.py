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
def profile(request, id, page="posts"):

     # Incase the user makes a typo in URL
     if page not in ["posts", "comments", "likes"]:
        page = "posts"

     return render(request, "users/profile.html", {
         "profile": id,
         "page": page
     })

def profile_redirect(request, id):
     """This is for when the users only types only the users id such as 'users/1'.
     This should just redirect them to posts."""
     return render(request, "users/profile.html", {
         "profile": id,
         "page": "posts"
     })


def login_view(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse("core:index"))
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