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
    query = request.GET.urlencode()[2:].replace("+", " ")
    return render(request, "core/search.html", {
        "query": query
    })


# API route

def users(request, input):

    users = User.objects.filter(username__contains=input)

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


def test(request):
    print(request)
    # Getting based on URL but splitting of the 'q='
    # Replace method for entries with more than one word
    return JsonResponse("No", safe=False)
    """input = request.GET.urlencode()[2:].replace("+", " ")
    print(input)"""
    """print(input)
    posts = Post.objects.filter(content__contains=input).order_by("-creation_date").all()

    if request.method == "GET":
        post_data = serializers.serialize('json', posts)
        return JsonResponse(post_data, safe=False)
    else:
        return JsonResponse({
            "error": "GET required for search."
        }, status=400)"""