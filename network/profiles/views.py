from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from users.models import User
from posts.models import Post, Comment
from django.core import serializers
from django.contrib.auth.decorators import login_required

# Create your views here.
def index(request):
     return render(request, "profiles/profile.html")


# API Routes
def profile(request, id):
    user = User.objects.get(pk=id)
    if request.method == "GET":
        return JsonResponse(user.serialize(), safe=False)
    else:
        return JsonResponse({
            "error": "GET required."
        }, status=400)