#!/bin/bash
# Docker Local Test Script

echo "🧪 Testing Docker Build and Run..."
echo ""

# Navigate to backend directory
cd backend

# Step 1: Build the image
echo "📦 Step 1: Building Docker image..."
docker build -t portfolio-backend:test .

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Step 2: Run the container
echo "🚀 Step 2: Starting container..."
docker run -d \
  --name portfolio-backend-test \
  -p 8000:8000 \
  -e SECRET_KEY="test-secret-key-for-docker-12345678" \
  -e CORS_ORIGINS="http://localhost:3000,http://127.0.0.1:3000" \
  -e PORT=8000 \
  -e HOST=0.0.0.0 \
  -e WORKERS=1 \
  -e ENVIRONMENT=production \
  -e DEBUG=false \
  portfolio-backend:test

if [ $? -ne 0 ]; then
    echo "❌ Container start failed!"
    exit 1
fi

echo "✅ Container started!"
echo ""

# Step 3: Wait for container to be ready
echo "⏳ Step 3: Waiting for container to be healthy..."
sleep 5

# Step 4: Test health endpoint
echo "🏥 Step 4: Testing health endpoint..."
for i in {1..10}; do
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health)
    if [ "$response" = "200" ]; then
        echo "✅ Health check passed!"
        break
    fi
    echo "   Attempt $i/10: Container not ready yet..."
    sleep 2
done

if [ "$response" != "200" ]; then
    echo "❌ Health check failed!"
    echo "📋 Container logs:"
    docker logs portfolio-backend-test
    docker stop portfolio-backend-test
    docker rm portfolio-backend-test
    exit 1
fi

echo ""

# Step 5: Test API endpoints
echo "🔍 Step 5: Testing API endpoints..."

echo "   Testing root endpoint..."
curl -s http://localhost:8000/ | grep -q "Portfolio CMS API" && echo "   ✅ Root endpoint works!"

echo "   Testing API docs..."
curl -s http://localhost:8000/api/docs | grep -q "html" && echo "   ✅ API docs accessible!"

echo "   Testing sitemap..."
curl -s http://localhost:8000/sitemap.xml | grep -q "xml" && echo "   ✅ Sitemap works!"

echo "   Testing robots.txt..."
curl -s http://localhost:8000/robots.txt | grep -q "User-agent" && echo "   ✅ Robots.txt works!"

echo ""

# Step 6: Show container info
echo "📊 Step 6: Container information..."
docker ps | grep portfolio-backend-test

echo ""
echo "🎉 All tests passed!"
echo ""
echo "📝 Container is running. You can:"
echo "   - View logs: docker logs -f portfolio-backend-test"
echo "   - Access API: http://localhost:8000"
echo "   - Access docs: http://localhost:8000/api/docs"
echo "   - Stop container: docker stop portfolio-backend-test"
echo "   - Remove container: docker rm portfolio-backend-test"
echo ""

# Ask if user wants to keep it running
read -p "Do you want to stop and remove the container? (y/N): " answer
if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
    echo "🛑 Stopping and removing container..."
    docker stop portfolio-backend-test
    docker rm portfolio-backend-test
    echo "✅ Container removed!"
else
    echo "✅ Container is still running!"
fi
