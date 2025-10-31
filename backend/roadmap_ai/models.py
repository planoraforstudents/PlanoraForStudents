from django.db import models
from django.conf import settings


class Roadmap(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE, related_name='roadmaps')
    title = models.CharField(max_length=255)
    goal = models.TextField(
        help_text="What user wants to achieve, e.g., 'Learn React for frontend jobs'")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class RoadmapStep(models.Model):
    roadmap = models.ForeignKey(
        Roadmap, on_delete=models.CASCADE, related_name='steps')
    title = models.CharField(max_length=255)
    description = models.TextField()
    order = models.PositiveIntegerField(default=0)
    resource_link = models.URLField(blank=True, null=True)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f"Step {self.order}: {self.title}"
