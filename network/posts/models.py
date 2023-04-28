from django.db import models
from users.models import User
import datetime

# Create your models here.

class Post(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="post_creator")
    content = models.CharField(max_length=500)
    post_image = models.URLField(blank=True, null=True)
    # Use auto_now_add so that it does not update timestamp for each save
    creation_date = models.DateTimeField(default=datetime.datetime.now())
    likers = models.ManyToManyField(User, blank=True, related_name="post_likers")


    def __str__(self):
        return self.content


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_comment")
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comment_creator")
    content = models.CharField(max_length=400)
    creation_date = models.DateTimeField(auto_now_add=True)
    likers = models.ManyToManyField(User, blank=True, related_name="comment_likers")

    def __str__(self):
        return f"{self.text} by {self.user}"