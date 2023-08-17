from .models import User
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer
from rest_framework import generics
from rest_framework import permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework import viewsets
from knox.models import AuthToken
from rest_framework.permissions import BasePermission
from django.contrib.auth import login


@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'users': reverse('user-list', request=request, format=format),
    })

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
            "users": UserSerializer(user, context=self.get_serializer_context()).data,
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