from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from . import api

router = DefaultRouter()
router.register(r"posts", api.PostViewSet, basename="posts_api")
router.register(r"posts/(?P<post_id>\d+)/comments", api.CommentViewSet, basename="posts_comments")

app_name = "posts"

urlpatterns = [

    path("<int:post_id>", views.view_post, name="view_post"),
    path("", views.index, name="all_posts"),
    path("<str:genre_code>", views.index_genres, name="genre_posts"),

    # API routes
    path('api/', include(router.urls)),
    path("api/posts/<int:post_id>/like", api.like_post, name="like_action"),
    path("api/posts/<int:post_id>/comments/<int:comment_id>/like", api.like_comment, name="like_action"),

]