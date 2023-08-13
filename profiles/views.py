from django.shortcuts import render
import json
from django.http import HttpResponse
from django.http import JsonResponse
from users.models import User
from posts.models import Post, Comment
from django.core import serializers
from django.contrib.auth.decorators import login_required

# Create your views here.
def index(request, id):
     profile = User.objects.get(pk=id)
     return render(request, "profiles/profile.html", {
         "profile": profile
     })


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


@login_required
def follow(request):

    user = User.objects.get(pk=request.user.pk)
    if request.method == "PUT":
        data = json.loads(request.body)
        if data.get("profile_id") is not None:
            if data.get("action") == "Follow":
                profile = User.objects.get(pk=int(data["profile_id"]))
                user.following.add(profile)
                profile.followers.add(user)
                user.save()
                profile.save()
                return HttpResponse(status=204)
            elif data.get("action") == "Unfollow":
                profile = User.objects.get(pk=int(data["profile_id"]))
                user.following.remove(profile)
                profile.followers.remove(user)
                user.save()
                profile.save()
                return HttpResponse(status=204)
        else:
            return JsonResponse({
                "error": "Something went wrong."
            }, status=400)
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)