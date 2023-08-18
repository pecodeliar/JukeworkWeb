from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):

    class Genre(models.IntegerChoices):
        # https://stackoverflow.com/questions/18676156/how-to-properly-use-the-choices-field-option-in-django
        JAZZ = 0, "JZ"
        RNB = 1, "RB"
        HIPHOP = 2, "HH"
        INSTRUMENTAL = 3, "IN"
        FOLK = 4, "FK"
        INDIE = 5, "IE"
        POP = 6, "PP"

    profile_picture = models.URLField(blank=True, default="https://static.vecteezy.com/system/resources/thumbnails/004/582/531/small/music-note-icon-design-symbol-music-note-sound-melody-musical-for-multimedia-free-vector.jpg")
    following = models.ManyToManyField("self", symmetrical=False, related_name="user_following", blank=True)
    followers = models.ManyToManyField("self", symmetrical=False, related_name="user_followers", blank=True)
    genre = models.PositiveSmallIntegerField(
        choices=Genre.choices,
        default=Genre.INDIE,
    )

    def __str__(self):
        return self.username