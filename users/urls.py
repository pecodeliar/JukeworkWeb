from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import api
from . import views
from knox import views as knox_views

app_name = "auth"

router = DefaultRouter()
router.register(r"users", api.UserViewSet, basename="user")

urlpatterns = [

   path("login", views.login_view, name="login"),
   path("logout", views.logout_view, name="logout"),
   path("register", views.register, name="register"),

   # API Routes
   path('', include(router.urls)),
   path('api/', include('knox.urls')),
   path('api/logout', knox_views.LogoutView.as_view(), name="knox-logout"),
   path('api/register', api.RegisterView.as_view()),
   path('api/login', api.LoginView.as_view()),

]