from users.models import User
from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.decorators import action
from rest_framework import status, permissions, viewsets

@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'posts': reverse('posts-list', request=request, format=format),
    })


class PostOrCommentPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action in ['list', 'retrieve']:
            return True
        elif view.action in ['create', 'update', 'partial_update', 'destroy']:
            return request.user and request.user.is_authenticated
        else:
            return False

    def has_object_permission(self, request, view, obj):

        if view.action == 'retrieve':
            return True
        elif view.action in ['create', 'update', 'partial_update', 'destroy']:
            return obj.creator == request.user or request.user.is_staff
        else:
            return False


@api_view(['GET', 'PATCH'])
def like_post(request, post_id):
    """This function is for liking a post.
    This is to avoid having to make a completely seperate model for likes."""
    data = request.data
    if request.method == 'PATCH':

        if data.get("action") not in ["Like", "Unlike"]:
            content = {"error": "You can only Like or Unlike"}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        post = Post.objects.get(pk=post_id)
        if data.get("action") == "Like":
            post.likers.add(request.user.id)
            post.save()
            likers = list(post.likers.all().values_list('pk', flat=True))
            return Response(likers)
        elif data.get("action") == "Unlike":
            post.likers.remove(request.user.id)
            post.save()
            likers = list(post.likers.all().values_list('pk', flat=True))
            return Response(likers)
        else:
            content = {"error": "Must to be a post."}
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({"error": "GET or PATCH request required."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH'])
def like_comment(request, post_id, comment_id):
    """This function is for liking a comment.
    This is to avoid having to make a completely seperate model for likes."""
    data = request.data
    if request.method == 'PATCH':

        if data.get("action") not in ["Like", "Unlike"]:
            content = {"error": "You can only Like or Unlike"}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        comment = Comment.objects.get(pk=comment_id)
        if data.get("action") == "Like":
            comment.likers.add(request.user.id)
            comment.save()
            likers = list(comment.likers.all().values_list('pk', flat=True))
            return Response(likers)
        elif data.get("action") == "Unlike":
            comment.likers.remove(request.user.id)
            comment.save()
            likers = list(comment.likers.all().values_list('pk', flat=True))
            return Response(likers)
        else:
            content = {"error": "Must to be a comment."}
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [PostOrCommentPermission]

    def perform_create(self, serializer):
        """
        This needs to be added because serializer does not have context of the user.
        """
        serializer.save(creator=self.request.user)

    def get_queryset(self):
        """
        This view will return a list of all posts with no filter.
        """
        return Post.objects.order_by("-creation_date").all()

    @action(detail=False, methods=['GET'], url_path='(?P<genre_code>[A-Z]{2})', permission_classes=[permissions.AllowAny])
    def genre(self, request, genre_code, *args, **kwargs):

        genres = {
            "JZ": 0,
            "RB": 1,
            "HH": 2,
            "IN": 3,
            "FK": 4,
            "IE": 5,
            "PP": 6
        }

        posts = self.get_queryset()
        users = User.objects.filter(genre=genres[genre_code])
        genre_posts = posts.filter(creator__in=users).order_by("-creation_date").all()
        results = results = PostSerializer(genre_posts, many=True).data
        return Response(results)

    @action(detail=False, methods=['GET'], url_path='following', permission_classes=[permissions.IsAuthenticated])
    def following(self, request, *args, **kwargs):

        posts = self.get_queryset()
        following = request.user.following.all()
        following_posts = posts.filter(creator__in=following).order_by('-creation_date')
        results = results = PostSerializer(following_posts, many=True).data
        return Response(results)


    @action(methods=['DELETE'], detail=False, permission_classes=[permissions.IsAuthenticated])
    def delete(self, request):
        # TODO
        """
        This view should delete all posts that belong to the user as a purge action.
        """
        posts =  Post.objects.filter(creator=request.user)
        posts.delete()
        return Response("All posts have been deleted.")


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [PostOrCommentPermission]

    # https://stackoverflow.com/questions/54983239/pass-url-parameter-to-serializer
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update(
            {
                "post_id": int(self.kwargs['post_id'])
            }
        )
        return context

    def perform_create(self, serializer):
        """
        This should be saved only to a specific post based on the URL parameter.
        """
        post = Post.objects.get(pk=self.kwargs['post_id'])
        serializer.save(post=post, creator=self.request.user)

    def get_queryset(self):
        """
        This view will return a list of all posts with no filter.
        """
        try:
            post = Post.objects.get(pk=self.kwargs.get("post_id"))
            comments = Comment.objects.filter(post=post)
        except (Post.DoesNotExist, Comment.DoesNotExist):
            return []
        return comments