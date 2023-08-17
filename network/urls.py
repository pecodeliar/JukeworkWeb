"""network URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from posts.urls import router as post_router
from users.urls import router as user_router

router = DefaultRouter()
router.registry.extend(post_router.registry)
router.registry.extend(user_router.registry)

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", include("core.urls", namespace="core")),
    path("api-auth/", include("rest_framework.urls")),
    path("auth/", include("users.urls")),
    path("posts/", include("posts.urls")),
    path("profiles/", include("profiles.urls")),
]
