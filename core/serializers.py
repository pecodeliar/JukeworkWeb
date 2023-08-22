from rest_framework import serializers
from posts.serializers import PostPKField
from users.serializers import UserPKField

class SearchResultSerializer(serializers.Serializer):
    users = UserPKField(many=True, read_only=True, allow_null=True)
    posts = PostPKField(many=True, read_only=True, allow_null=True)