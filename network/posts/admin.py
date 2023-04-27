from django.contrib import admin
from .models import Post, Comment

class PostAdmin(admin.ModelAdmin):
    list_display = ("creator", "id", "content", "post_image", "creation_date")
    horizontal_display = ("likers",)


class CommentAdmin(admin.ModelAdmin):
    list_display = ("post", "creator", "content", "creation_date")
    horizontal_display = ("likers",)

# Register your models here.
admin.site.register(Post, PostAdmin),
admin.site.register(Comment, CommentAdmin),
