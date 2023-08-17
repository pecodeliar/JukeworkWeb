from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
import network.local_settings

class UserPKField(serializers.PrimaryKeyRelatedField):
    def get_queryset(self):
        queryset = User.objects.all()
        return queryset

class UserSerializer(serializers.HyperlinkedModelSerializer):
    following = UserPKField(many=True, read_only=True)
    followers = UserPKField(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username","first_name",
            "profile_picture",
            "following",
            "followers",
            "genre"
        ]

    extra_kwargs = {
        'id': {'read_only': True},
        'username': {'read_only': True}
    }


class RegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password1",
            "password2"
        ]

        extra_kwargs = {"password1": {"write_only": True}, "password2": {"write_only": True}}

    def create(self, validated_data):
        username = self.validated_data["username"]
        email = self.validated_data['email']
        password = self.validated_data["password1"]
        confirmation = self.validated_data["password2"]

        if email != network.local_settings.email:
            raise serializers.ValidationError({"error": "You are not allowed to use this app."})

        # Ensure password matches confirmation
        if password != confirmation:
            raise serializers.ValidationError({"error": "Passwords must match."})

        try:
            validate_password(password)
        except ValidationError as err:
            raise serializers.ValidationError({"error": ' '.join(err.messages)})

        # Make new user and save to database
        user = User.objects.create_user(username, email, password)
        user.save()
        return user


# https://www.section.io/engineering-education/api-authentication-with-django-knox-and-postman-testing/
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError({"error": "Incorrect credentials"})