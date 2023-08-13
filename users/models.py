from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    JAZZ = "JZ"
    RNB = "RB"
    HIPHOP = "HH"
    INSTRUMENTAL = "IN"
    FOLK = "FK"
    INDIE = "IE"
    POP = "PP"
    GENRE_CHOICES = [
        (JAZZ, "Jazz"),
        (RNB, "R&B / Soul"),
        (HIPHOP, "Hip-Hop"),
        (INSTRUMENTAL, "Classical"),
        (FOLK, "Folk / Acoustic"),
        (INDIE, "Indie / Alternative"),
        (POP, "Pop")
    ]
    profile_picture = models.URLField(blank=True, default="https://static.vecteezy.com/system/resources/thumbnails/004/582/531/small/music-note-icon-design-symbol-music-note-sound-melody-musical-for-multimedia-free-vector.jpg")
    following = models.ManyToManyField("self", symmetrical=False, related_name="user_following", blank=True)
    followers = models.ManyToManyField("self", symmetrical=False, related_name="user_followers", blank=True)
    banner = models.URLField(blank=True, default="https://cdn.pixabay.com/photo/2014/01/15/12/44/classical-music-245590_1280.jpg")
    genre = models.CharField(
        max_length=2,
        choices=GENRE_CHOICES,
        default=INDIE,
    )

    def __str__(self):
        return self.username

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "pfp_url":  self.profile_picture,
            "following": [user.id for user in self.following.all()],
            "followers": [user.id for user in self.followers.all()],
            "banner_url":  self.banner,
            "genre":  self.genre,
        }