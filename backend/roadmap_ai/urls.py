from django.urls import path
from . import views

urlpatterns = [
    path('roadmaps/', views.get_roadmaps, name='get_roadmaps'),
    path('roadmaps/create/', views.create_roadmap, name='create_roadmap'),
    path('roadmaps/generate/', views.generate_ai_roadmap,
         name='generate_ai_roadmap'),

]
