from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    following = models.ManyToManyField("self", symmetrical=False, related_name="user_following")
    followers = models.ManyToManyField("self", symmetrical=False, related_name="user_followers")

    def serialize(self):
        return {
            "id": self.id,
        }