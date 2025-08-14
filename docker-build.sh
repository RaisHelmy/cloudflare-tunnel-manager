#!/bin/bash

# Docker build and push script for Cloudflare Tunnel Manager
# Usage: ./docker-build.sh [tag] [--multi-platform]

set -e

# Configuration
DOCKER_IMAGE="raishelmy/cloudflare-tunnel-manager"
TAG=${1:-latest}
FULL_IMAGE="${DOCKER_IMAGE}:${TAG}"
MULTI_PLATFORM=false

# Check for multi-platform flag
if [[ "$2" == "--multi-platform" || "$1" == "--multi-platform" ]]; then
    MULTI_PLATFORM=true
    if [[ "$1" == "--multi-platform" ]]; then
        TAG="latest"
        FULL_IMAGE="${DOCKER_IMAGE}:${TAG}"
    fi
fi

echo "🐳 Building Docker image: $FULL_IMAGE"
if [[ "$MULTI_PLATFORM" == "true" ]]; then
    echo "📦 Multi-platform build: AMD64 + ARM64"
fi

# Build the image
if [[ "$MULTI_PLATFORM" == "true" ]]; then
    # Multi-platform build using buildx
    docker buildx build --platform linux/amd64,linux/arm64 -t $FULL_IMAGE --load .
else
    # Single platform build
    docker build -t $FULL_IMAGE .
fi

echo "✅ Successfully built $FULL_IMAGE"

# Test the image
echo "🧪 Testing the image..."
CONTAINER_ID=$(docker run -d -p 3001:3001 $FULL_IMAGE)

# Wait for container to start
sleep 10

# Health check
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    docker logs $CONTAINER_ID
    docker stop $CONTAINER_ID
    exit 1
fi

# Stop test container
docker stop $CONTAINER_ID

# Push to Docker Hub (optional)
read -p "Push to Docker Hub? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Pushing to Docker Hub..."
    
    if [[ "$MULTI_PLATFORM" == "true" ]]; then
        # Multi-platform push requires --push flag during build
        echo "📦 Building and pushing multi-platform image..."
        docker buildx build --platform linux/amd64,linux/arm64 -t $FULL_IMAGE --push .
    else
        docker push $FULL_IMAGE
    fi
    
    echo "✅ Successfully pushed $FULL_IMAGE"
    
    # Also tag and push as latest if not already latest
    if [[ $TAG != "latest" ]]; then
        if [[ "$MULTI_PLATFORM" == "true" ]]; then
            docker buildx build --platform linux/amd64,linux/arm64 -t "${DOCKER_IMAGE}:latest" --push .
        else
            docker tag $FULL_IMAGE "${DOCKER_IMAGE}:latest"
            docker push "${DOCKER_IMAGE}:latest"
        fi
        echo "✅ Also pushed as latest"
    fi
else
    echo "⏭️  Skipping Docker Hub push"
fi

echo "🎉 Build complete!"
echo "📋 To run the image:"
echo "   docker run -d -p 3001:3001 $FULL_IMAGE"
echo "📋 To run with Docker Compose:"
echo "   docker-compose up -d"
if [[ "$MULTI_PLATFORM" == "true" ]]; then
    echo "🏗️  Multi-platform support: Works on AMD64 (Intel/AMD) and ARM64 (Apple Silicon) systems"
fi