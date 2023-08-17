from django.shortcuts import render
import json
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django import forms
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from users.models import User
from .models import Post, Comment
from django.core import serializers
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponseRedirect


# Create your views here.
def view_post(request, post_id):
    return render(request, "posts/posts.html", {
        "page": "post",
        "post": post_id
     })

def index(request):
    return HttpResponseRedirect(reverse("core:index"))

def index_genres(request, genre_code):
    return render(request, "posts/posts.html", {
        "page": genre_code,
     })
