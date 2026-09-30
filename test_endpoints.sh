#!/bin/bash

# Start server in background
cd backend
node server.js &
SERVER_PID=$!

# Wait for server to start
sleep 2

echo "Testing Health Endpoint..."
curl -s http://localhost:5000/api/health | grep '"status":"ok"'
if [ $? -eq 0 ]; then
    echo "✅ Health endpoint passed"
else
    echo "❌ Health endpoint failed"
fi

echo "Testing Student Login..."
LOGIN_RES=$(curl -s -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"username":"BITM2026DS001", "password":"password"}')

TOKEN=$(echo $LOGIN_RES | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

if [ -n "$TOKEN" ]; then
    echo "✅ Login successful"
else
    echo "❌ Login failed"
    kill $SERVER_PID
    exit 1
fi

echo "Testing Profile Endpoint..."
PROFILE_RES=$(curl -s http://localhost:5000/api/student/profile -H "Authorization: Bearer $TOKEN")

if echo "$PROFILE_RES" | grep -q 'Aparna Yadavalli'; then
    echo "✅ Profile endpoint passed"
else
    echo "❌ Profile endpoint failed: $PROFILE_RES"
fi

# Clean up
kill $SERVER_PID
echo "Tests complete."
