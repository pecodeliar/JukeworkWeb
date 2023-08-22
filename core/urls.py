from django.urls import path
from . import views
from . import api


app_name="core"

urlpatterns = [

   path("", views.index, name="index"),
   path("search", views.search, name="search"),
   path("following", views.following, name="following"),
   path("settings", views.settings, name="settings"),

   # API Routes
   path("api/search/<str:query>", api.search, name="search_api"),
   path("api/settings/edit", views.edit_settings, name="edit"),

]