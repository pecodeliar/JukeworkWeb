from .models import User
from posts.models import Post, Comment
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer
from posts.serializers import PostSerializer, CommentSerializer
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from knox.models import AuthToken
from django.contrib.auth import login
from rest_framework.decorators import action


@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'users': reverse('user-list', request=request, format=format),
    })


@api_view(['GET', 'PATCH'])
def follow(request, user_id):
    """This function is for following or unfollowing a user.
    This is to avoid having to make a completely seperate model for followers and following.
    Also to put less risk on the user model from being manipulated from the viewset."""

    signed_in_user = User.objects.get(pk=request.user.pk)
    user_followed = User.objects.get(pk=user_id)

    # Prevent user from following themselves
    if signed_in_user is user_followed:
        return Response({"error": "You cannot follow yourself."}, status=status.HTTP_400_BAD_REQUEST)

    data = request.data
    if request.method == 'PATCH':

        if data.get("action") not in ["Follow", "Unfollow"]:
            content = {"error": "You can only Follow or Unfollow."}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        if data.get("action") == "Follow":
            signed_in_user.following.add(user_followed)
            user_followed.followers.add(signed_in_user)
            signed_in_user.save()
            user_followed.save()
            user_followers_list = list(user_followed.followers.all().values_list('pk', flat=True))
            return Response(user_followers_list)
        elif data.get("action") == "Unfollow":
            signed_in_user.following.remove(user_followed)
            user_followed.followers.remove(signed_in_user)
            signed_in_user.save()
            user_followed.save()
            user_followers_list = list(user_followed.followers.all().values_list('pk', flat=True))
            return Response(user_followers_list)

    return Response({"error": "GET or PATCH request required."}, status=status.HTTP_400_BAD_REQUEST)

class UserPermission(permissions.BasePermission):

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
            return obj == request.user or request.user.is_staff
        else:
            return False



class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [UserPermission]
    queryset = User.objects.all()


    @action(detail=False, methods=['GET'], url_path='(?P<user_id>\d+)/posts', permission_classes=[permissions.AllowAny])
    def posts(self, request, user_id, *args, **kwargs):
        """This for getting all the posts of a particular user."""

        users = self.get_queryset()
        user = users.get(pk=user_id)
        posts = Post.objects.filter(creator=user).order_by("-creation_date").all()
        results = PostSerializer(posts, many=True).data
        return Response(results)


    @action(detail=False, methods=['GET'], url_path='(?P<user_id>\d+)/likes', permission_classes=[permissions.AllowAny])
    def likes(self, request, user_id, *args, **kwargs):
        """"This is for getting all the posts liked by a user."""

        users = self.get_queryset()
        user = users.get(pk=user_id)
        posts = Post.objects.filter(likers__id=user.pk).order_by("-creation_date").all()
        results = PostSerializer(posts, many=True).data
        return Response(results)


    @action(detail=False, methods=['GET'], url_path='(?P<user_id>\d+)/comments', permission_classes=[permissions.AllowAny])
    def comments(self, request, user_id, *args, **kwargs):
        """This for getting all the comments made by a user"""

        users = self.get_queryset()
        user = users.get(pk=user_id)
        comments = Comment.objects.filter(creator=user).order_by("-creation_date").all()
        results = CommentSerializer(comments, many=True).data
        return Response(results)



class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    queryset = User.objects.all()

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = AuthToken.objects.create(user)
        login(request, user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token[1]
        })


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        login(request, user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })