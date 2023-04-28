from django.shortcuts import render
import json
from django.http import HttpResponse
from users.models import User
from posts.models import Post
from django.core import serializers
from django.http import JsonResponse
from django.db.models import Q
from django.contrib.auth.decorators import login_required

# Create your views here.
def index(request):
     return render(request, "posts/posts.html", {
         "page": "all"
     })


def search(request):
    query = request.GET.urlencode()[2:].replace("+", " ")
    return render(request, "core/search.html", {
        "query": query
    })


@login_required
def following(request):
     return render(request, "posts/posts.html", {
        "page": "following"
     })


@login_required
def settings(request):
    profile = User.objects.get(pk=request.user.pk)
    return render(request, "core/settings.html", {
         "profile": profile
     })

# API route

def users(request, input):
    users = User.objects.filter( Q(first_name__contains=input) | Q(username__contains=input))
    print(users)

    if request.method == "GET":
        return JsonResponse([user.serialize() for user in users], safe=False)
    else:
        return JsonResponse({
            "error": "GET required for user search."
        }, status=400)


def posts(request, input):

    posts = Post.objects.filter(content__contains=input).order_by("-creation_date").all()

    if request.method == "GET":
        post_data = serializers.serialize('json', posts)
        return JsonResponse(post_data, safe=False)
    else:
        return JsonResponse({
            "error": "GET required for post search."
        }, status=400)


@login_required
def edit_settings(request):
    user = User.objects.get(pk=request.user.pk)
    if request.method == "PUT":
        data = json.loads(request.body)
        if data.get("action") == "edit":
            user.profile_picture = data["pfp_url"]
            user.banner = data["banner_url"]
            user.first_name = data["first_name"]
            user.genre = data["genre"]
            user.save()
            return HttpResponse(status=204)
        else:
            return JsonResponse({
                "error": "Action must be editing."
            }, status=400)
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)