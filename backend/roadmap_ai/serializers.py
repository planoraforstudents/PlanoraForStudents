from rest_framework import serializers
from .models import Roadmap, RoadmapStep


class RoadmapStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoadmapStep
        fields = '__all__'


class RoadmapSerializer(serializers.ModelSerializer):
    steps = RoadmapStepSerializer(many=True, read_only=True)

    class Meta:
        model = Roadmap
        fields = '__all__'
