from django.urls import path

from . import views

app_name = "posts"

urlpatterns = [

    path("home", views.index, name="index"),

    # API routes
    path("", views.posts, name="posts"),
    path("following", views.following, name="following"),
    path("<str:genre_code>", views.genre, name="genre"),
    path("post/<int:post_id>", views.post, name="post"),
    path("post/<int:post_id>/comments", views.comments, name="comments"),
    path("comment/<int:comment_id>", views.comment, name="comment"),
    path("create", views.create, name="create")

]