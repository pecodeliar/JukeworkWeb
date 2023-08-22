from users.models import User
from posts.models import Post
from .serializers import SearchResultSerializer
from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
def search(request, query):
    """A search function that should return both users and posts that match the query."""
    users = User.objects.filter( Q(first_name__contains=query) | Q(username__contains=query))
    posts = Post.objects.filter(content__contains=query).order_by("-creation_date").all()
    dict = {
        "users": users,
        "posts": posts
    }
    results = SearchResultSerializer(dict).data
    return Response(results)
