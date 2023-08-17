from rest_framework import serializers
from .models import Post, Comment
from users.models import User

class UserPKField(serializers.PrimaryKeyRelatedField):
    def get_queryset(self):
        queryset = User.objects.all()
        return queryset

class PostPKField(serializers.PrimaryKeyRelatedField):
    def get_queryset(self):
        queryset = Post.objects.all()
        return queryset


class CommentPKField(serializers.PrimaryKeyRelatedField):
    def get_queryset(self):
        queryset = Comment.objects.all()
        return queryset

class PostSerializer(serializers.ModelSerializer):
    creator = UserPKField(read_only=True, default=serializers.CurrentUserDefault())
    likers = UserPKField(many=True, read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "creator",
            "content",
            "post_image",
            "creation_date",
            "likers",
        ]

        extra_kwargs = {
            'creator': {'required': True},
            'content': {'required': True},
        }


class CommentSerializer(serializers.ModelSerializer):
    post = PostPKField(many=False)
    creator = UserPKField(read_only=True, default=serializers.CurrentUserDefault())
    likers = UserPKField(many=True, read_only=True)

    class Meta:
        model = Comment
        fields = [
            "id",
            "post",
            "creator",
            "content",
            "creation_date",
            "likers",
        ]

        extra_kwargs = {
            'creator': {'required': True},
            'post': {'required': True},
            'content': {'required': True},
            }

        def get_post(self, obj):
            return self.context.get("post_id")


class PostWithCommentsSerializer(serializers.Serializer):
    post = PostSerializer(read_only=True)
    comments = CommentSerializer(read_only=True, allow_null=True, many=True)