from django.db import models
from users.models import User
import django

# Create your models here.

class Post(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="post_creator")
    content = models.CharField(max_length=500)
    # Use auto_now_add so that it does not update timestamp for each save
    creation_date = models.DateTimeField(auto_now_add=True)
    likers = models.ManyToManyField(User, blank=True, related_name="post_likers")

    def serialize(self):
        return {
            "post_id": self.id,
            "creator": self.creator.id,
            "content": self.content,
            "creation_date": self.creation_date.strftime("%b %d %Y, %I:%M %p"),
            "likers": [user.username for user in self.likers.all()],
        }


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_comment")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comment_creator")
    text = models.CharField(max_length=400)
    creation_date = models.DateField(default=django.utils.timezone.now())
    likers = models.ManyToManyField(User, blank=True, related_name="comment_likers")

    def serialize(self):
        return {
            "id": self.id,
            "post_id": self.post.id,
            "creator": self.user.id,
            "text": self.content,
            "creation_date": self.creation_date.strftime("%b %d %Y, %I:%M %p"),
            "likers": [user.username for user in self.likers.all()],
        }