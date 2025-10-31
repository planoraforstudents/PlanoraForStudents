from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Roadmap, RoadmapStep
from .serializers import RoadmapSerializer
from .gemini_service import generate_roadmap


@api_view(['GET'])
def get_roadmaps(request):
    roadmaps = Roadmap.objects.all()
    serializer = RoadmapSerializer(roadmaps, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_roadmap(request):
    serializer = RoadmapSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def generate_ai_roadmap(request):
    goal = request.data.get("goal")
    user_id = request.data.get("user_id")

    if not goal:
        return Response({"error": "Goal is required"}, status=400)

    # Generate roadmap text using Gemini
    prompt = (
        f"Generate a detailed learning or project roadmap for: {goal}. "
        "Break it into structured steps, each with a title, description, and suggested resource link. Also add projects with every end of module."
    )
    roadmap_text = generate_roadmap(prompt)

    # Save roadmap to database
    roadmap = Roadmap.objects.create(
        user_id=user_id if user_id else None,
        title=f"AI Roadmap for {goal[:50]}",
        goal=goal
    )

    # Split Gemini response into steps
    for i, line in enumerate(roadmap_text.split("\n")):
        if line.strip():
            RoadmapStep.objects.create(
                roadmap=roadmap,
                title=f"Step {i+1}",
                description=line.strip(),
                order=i+1
            )

    serializer = RoadmapSerializer(roadmap)
    return Response(serializer.data, status=status.HTTP_201_CREATED)
