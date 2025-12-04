#!/usr/bin/env bash

# Usage: PUSH_IMAGE=true IMAGE_TAG=v1.0.0 REGISTRY_USERNAME=myusername ./scripts/build_tag_docker_image.sh

# Build the Docker image with a tag from the environment variable or default to 'latest'
IMAGE_TAG=${IMAGE_TAG:-latest}
REGISTRY_USERNAME=${REGISTRY_USERNAME:-moabdelazem}
IMAGE_NAME="${REGISTRY_USERNAME}/ci-project:${IMAGE_TAG}"
PUSH_IMAGE=${PUSH_IMAGE:-false}

# Check Docker installation
if ! command -v docker &> /dev/null; then
  echo "Docker is not installed or not running if you are using Docker Desktop on windows. Please install or run Docker to proceed."
  exit 1
fi

if docker build -t "$IMAGE_NAME" .; then
  echo "Docker image built successfully: $IMAGE_NAME"
else
  echo "Failed to build Docker image"
  exit 1
fi

# Optionally push the Docker image to a registry if PUSH_IMAGE is set to true
if [ "$PUSH_IMAGE" == "true" ]; then
    if docker push "$IMAGE_NAME"; then
        echo "Docker image pushed successfully: $IMAGE_NAME"
    else
        echo "Failed to push Docker image"
        exit 1
    fi
fi

# Run the Docker container from the built image
if docker run -d -p 3000:3000 --name ci_project_container "$IMAGE_NAME"; then
  echo "Docker container started successfully from image: $IMAGE_NAME"
else
  echo "Failed to start Docker container"
  exit 1
fi