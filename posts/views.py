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


# Create your views here.

# Create your views here.
def view_post(request, post_id):
    post = Post.objects.get(pk=post_id)
    return render(request, "posts/posts.html", {
        "page": "post",
        "post": post_id
     })

# API routes

def post(request, post_id):
    post = Post.objects.get(pk=post_id)
    if request.method == "GET":
        data = serializers.serialize('json', [post, ])
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)


def posts(request):
    posts = Post.objects.order_by("-creation_date")
    if request.method == "GET":
        data = serializers.serialize('json', posts)
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({
            "error": "GET required for Posts views."
        }, status=400)


def genre(request, genre_code):
    users = User.objects.filter(genre=genre_code)
    posts = Post.objects.filter(creator__in=users).order_by("-creation_date").all()
    if request.method == "GET":
        data = serializers.serialize('json', posts)
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({
            "error": "GET required for genre view."
        }, status=400)


@login_required
def create(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    creator = User.objects.get(pk=request.user.pk)
    if data.get("type") is not None:
        # For Posts
        if data.get("type") == "Post":
            content = data.get("content").strip()
            if content == "":
                return JsonResponse({
                    "error": "Post cannot be empty."
                }, status=400)
            post = Post(creator=creator, content=content)
            post.save()
            data = serializers.serialize('json', [post, ])
            #return JsonResponse(data, safe=False)
            return JsonResponse(data, safe=False, status=201)
        # For Comments
        elif data.get("type") == "Comment":
            content = data.get("content").strip()
            post_id = data.get("post_id")
            if content == "":
                return JsonResponse({
                    "error": "Comment cannot be empty."
                }, status=400)
            elif post_id == "":
                return JsonResponse({
                    "error": "Comment must have a post parent."
                }, status=400)
            post = Post.objects.get(pk=post_id)
            comment = Comment(post=post, creator=creator, content=content)
            comment.save()
            data = serializers.serialize('json', [comment, ])
            return JsonResponse(data, safe=False, status=201)
    else:
        return JsonResponse({
            "error": "Type of creation required."
        }, status=400)


@login_required
def action(request, post_id):
    post = Post.objects.get(pk=post_id)
    if request.method == "PUT":
        data = json.loads(request.body)
        # If they are trying to edit the content, make sure they are the owner of that post
        if data.get("content") is not None:
            if data.get("type") == "post":
                if request.user.id == post.creator.id:
                    post.content = data["content"]
                    post.save()
                    return HttpResponse(status=204)
                else:
                    return JsonResponse({
                        "error": "You are not the user of this post."
                    }, status=400)
            elif data.get("type") == "comment":
                comment = Comment.objects.get(pk=data.get("id"))
                if request.user.id == comment.creator.id:
                    comment.content = data["content"]
                    comment.save()
                    return HttpResponse(status=204)
                else:
                    return JsonResponse({
                        "error": "You are not the user of this post."
                    }, status=400)
        # User is likeing the content
        elif data.get("action") is not None:
            if data.get("type") == "post":
                if data.get("action") == "Like":
                    post.likers.add(request.user.id)
                    post.save()
                    return HttpResponse(status=204)
                elif data.get("action") == "Unlike":
                    post.likers.remove(request.user.id)
                    post.save()
                    return HttpResponse(status=204)
            elif data.get("type") == "comment":
                comment = Comment.objects.get(pk=data.get("id"))
                if data.get("action") == "Like":
                    comment.likers.add(request.user.id)
                    comment.save()
                    return HttpResponse(status=204)
                elif data.get("action") == "Unlike":
                    comment.likers.remove(request.user.id)
                    comment.save()
                    return HttpResponse(status=204)
            else:
                return JsonResponse({
                    "error": "Has to be a post or comment."
                }, status=400)
        else:
                return JsonResponse({
                    "error": "Something went wrong."
                }, status=400)
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)


def comments(request, post_id):

    post = Post.objects.get(pk=post_id)
    comments = Comment.objects.filter(post=post)
    if request.method == "GET":
        data = serializers.serialize('json', comments)
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({"error": "GET request required."}, status=400)


@login_required
def edit_comment(request, comment_id):
    comment = Comment.objects.get(pk=comment_id)
    if request.method == "GET":
        data = serializers.serialize('json', comment)
        return JsonResponse(data, safe=False)
    elif request.method == "PUT":
        data = json.loads(request.body)
        # If they are trying to edit the content, make sure they are the owner of that post
        if data.get("content") is not None:
            if request.user.id == comment.creator.id:
                post.content = data["content"]
                post.save()
                return HttpResponse(status=204)
            else:
                return JsonResponse({
                    "error": "You are not the user of this comment."
                }, status=400)
        # User is likeing the content
        elif data.get("action") is not None:
            if data.get("action") == "Like":
                comment.likers.add(request.user.id)
                comment.save()
                return HttpResponse(status=204)
            elif data.get("action") == "Unlike":
                comment.likers.remove(request.user.id)
                comment.save()
                return HttpResponse(status=204)
        else:
                return JsonResponse({
                    "error": "Something went wrong."
                }, status=400)
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)


@login_required
def following(request):

    user = User.objects.get(pk=request.user.pk)
    # Figure out who the logged in user is following
    following = user.following.all()
    posts = Post.objects.filter(creator__in=following).order_by('-creation_date')
    if request.method == "GET":
        data = serializers.serialize('json', posts)
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({
            "error": "GET required for following view."
        }, status=400)


@login_required
def delete(request):
    ...


@login_required
def purge(request):
    user = User.objects.get(pk=request.user.pk)
    posts = Post.objects.filter(creator=user).all()
    print(posts)
    if request.method == "DELETE":
        posts.delete()
        return HttpResponse(status=204)
    else:
        return JsonResponse({
            "error": "DELETE request required."
        }, status=400)