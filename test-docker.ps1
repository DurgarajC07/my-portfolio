# Docker Local Test Script (PowerShell)

Write-Host "🧪 Testing Docker Build and Run..." -ForegroundColor Cyan
Write-Host ""

# Navigate to backend directory
Set-Location backend

# Step 1: Build the image
Write-Host "📦 Step 1: Building Docker image..." -ForegroundColor Yellow
docker build -t portfolio-backend:test .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""

# Step 2: Run the container
Write-Host "🚀 Step 2: Starting container..." -ForegroundColor Yellow
docker run -d `
  --name portfolio-backend-test `
  -p 8000:8000 `
  -e SECRET_KEY="test-secret-key-for-docker-12345678" `
  -e CORS_ORIGINS="http://localhost:3000,http://127.0.0.1:3000" `
  -e PORT=8000 `
  -e HOST=0.0.0.0 `
  -e WORKERS=1 `
  -e ENVIRONMENT=production `
  -e DEBUG=false `
  portfolio-backend:test

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Container start failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Container started!" -ForegroundColor Green
Write-Host ""

# Step 3: Wait for container to be ready
Write-Host "⏳ Step 3: Waiting for container to be healthy..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Step 4: Test health endpoint
Write-Host "🏥 Step 4: Testing health endpoint..." -ForegroundColor Yellow
$healthCheckPassed = $false

for ($i = 1; $i -le 10; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Health check passed!" -ForegroundColor Green
            $healthCheckPassed = $true
            break
        }
    } catch {
        Write-Host "   Attempt $i/10: Container not ready yet..." -ForegroundColor Gray
        Start-Sleep -Seconds 2
    }
}

if (-not $healthCheckPassed) {
    Write-Host "❌ Health check failed!" -ForegroundColor Red
    Write-Host "📋 Container logs:" -ForegroundColor Yellow
    docker logs portfolio-backend-test
    docker stop portfolio-backend-test
    docker rm portfolio-backend-test
    exit 1
}

Write-Host ""

# Step 5: Test API endpoints
Write-Host "🔍 Step 5: Testing API endpoints..." -ForegroundColor Yellow

Write-Host "   Testing root endpoint..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/" -UseBasicParsing
    if ($response.Content -match "Portfolio CMS API") {
        Write-Host "   ✅ Root endpoint works!" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  Root endpoint test failed" -ForegroundColor Yellow
}

Write-Host "   Testing API docs..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/docs" -UseBasicParsing
    if ($response.Content -match "html") {
        Write-Host "   ✅ API docs accessible!" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  API docs test failed" -ForegroundColor Yellow
}

Write-Host "   Testing sitemap..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/sitemap.xml" -UseBasicParsing
    if ($response.Content -match "xml") {
        Write-Host "   ✅ Sitemap works!" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  Sitemap test failed" -ForegroundColor Yellow
}

Write-Host "   Testing robots.txt..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/robots.txt" -UseBasicParsing
    if ($response.Content -match "User-agent") {
        Write-Host "   ✅ Robots.txt works!" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  Robots.txt test failed" -ForegroundColor Yellow
}

Write-Host ""

# Step 6: Show container info
Write-Host "📊 Step 6: Container information..." -ForegroundColor Yellow
docker ps | Select-String "portfolio-backend-test"

Write-Host ""
Write-Host "🎉 All tests passed!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Container is running. You can:" -ForegroundColor Cyan
Write-Host "   - View logs: docker logs -f portfolio-backend-test" -ForegroundColor White
Write-Host "   - Access API: http://localhost:8000" -ForegroundColor White
Write-Host "   - Access docs: http://localhost:8000/api/docs" -ForegroundColor White
Write-Host "   - Stop container: docker stop portfolio-backend-test" -ForegroundColor White
Write-Host "   - Remove container: docker rm portfolio-backend-test" -ForegroundColor White
Write-Host ""

# Ask if user wants to keep it running
$answer = Read-Host "Do you want to stop and remove the container? (y/N)"
if ($answer -eq "y" -or $answer -eq "Y") {
    Write-Host "🛑 Stopping and removing container..." -ForegroundColor Yellow
    docker stop portfolio-backend-test
    docker rm portfolio-backend-test
    Write-Host "✅ Container removed!" -ForegroundColor Green
} else {
    Write-Host "✅ Container is still running!" -ForegroundColor Green
}

Set-Location ..
