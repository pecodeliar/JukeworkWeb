from django.urls import path

from . import views

app_name = "posts"

urlpatterns = [

    # API routes
    path("api/all", views.posts, name="posts"),
    path("api/following", views.following, name="following"),
    path("api/genre/<str:genre_code>", views.genre, name="genre"),
    path("api/post/<int:post_id>", views.post, name="post"),
    path("api/post/<int:post_id>/comments", views.comments, name="comments"),
    path("api/comment/<int:comment_id>", views.comment, name="comment"),
    path("api/create", views.create, name="create"),
    path("api/delete", views.delete, name="delete"),
    path("api/purge", views.purge, name="purge")

]