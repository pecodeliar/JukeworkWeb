from django.urls import path
from . import views

app_name = "profiles"

urlpatterns = [

    path("<int:id>", views.index, name=""),

    # API Routes
    path("api/profile/<int:id>", views.profile, name="profile"),
    path("api/profile/<int:id>/posts", views.posts, name="posts"),
    path("api/profile/<int:id>/comments", views.comments, name="comments"),
    path("api/profile/<int:id>/likes", views.likes, name="likes"),
    path("api/follow", views.follow, name="follow"),
]