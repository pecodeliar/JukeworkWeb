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


def posts(request, id):
    user = User.objects.filter(pk=id)
    posts = Post.objects.filter(creator__in=user).order_by("-creation_date").all()
    if request.method == "GET":
        data = serializers.serialize('json', posts)
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({
            "error": "GET required for posts."
        }, status=400)


def comments(request, id):
    user = User.objects.filter(pk=id)
    comments = Comment.objects.filter(user__in=user).order_by("-creation_date").all()
    if request.method == "GET":
        data = serializers.serialize('json', comments)
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({
            "error": "GET required for comments."
        }, status=400)


def likes(request, id):
    user = User.objects.filter(pk=id)
    likes = Post.objects.filter(likers__in=user).order_by("-creation_date").all()
    if request.method == "GET":
        data = serializers.serialize('json', likes)
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({
            "error": "GET required for likes."
        }, status=400)