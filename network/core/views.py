from django.shortcuts import render
import json
from django.http import HttpResponse
from users.models import User
from posts.models import Post
from django.core import serializers
from django.http import JsonResponse

# Create your views here.
def index(request):
     return render(request, "posts/posts.html")

def search(request):
    return render(request, "core/search.html")


# API route

def users(request):
    # Getting based on URL but splitting of the 'q='
    # Replace method for entries with more than one word
    input = request.GET.urlencode()[2:].replace("+", " ")
    users = User.objects.filter(username__contains=input)

    if request.method == "GET":
        user_data = serializers.serialize('json', users)
        return JsonResponse(user_data, safe=False)
    else:
        return JsonResponse({
            "error": "GET required for search."
        }, status=400)


def posts(request):
    # Getting based on URL but splitting of the 'q='
    # Replace method for entries with more than one word
    input = request.GET.urlencode()[2:].replace("+", " ")
    print(users)
    posts = Post.objects.filter(content__in=input).order_by("-creation_date").all()

    if request.method == "GET":
        post_data = serializers.serialize('json', posts)
        return JsonResponse(post_data, safe=False)
    else:
        return JsonResponse({
            "error": "GET required for search."
        }, status=400)