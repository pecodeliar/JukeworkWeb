from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from users.models import User
from posts.models import Post, Comment
from django.core import serializers
from django.contrib.auth.decorators import login_required

# Create your views here.
def profile(request):
     return render(request, "profiles/profile.html")


# API Routes