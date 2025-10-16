#!/bin/bash
# CHARAK API Integration Test Script

API_URL="http://localhost:3001"
echo "🧪 Testing CHARAK API Integration..."
echo "=================================="
echo ""

# Test 1: Health Check
echo "1️⃣  Testing Health Check..."
curl -s "$API_URL/api/health" | jq -r '.status'
echo ""

# Test 2: Database Test
echo "2️⃣  Testing Database Connection..."
curl -s "$API_URL/api/db-test" | jq -r '.status'
echo ""

# Test 3: Login (Doctor)
echo "3️⃣  Testing Doctor Login..."
TOKEN=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"demodoctor","password":"123"}' | jq -r '.token')
echo "Token received: ${TOKEN:0:50}..."
echo ""

# Test 4: Search Disorders
echo "4️⃣  Testing Disorder Search..."
curl -s "$API_URL/api/disorders/search?query=fever&limit=2" | jq -c '.[] | {name: .englishName, code: .icd11Code}'
echo ""

# Test 5: Get Patient by ABHA
echo "5️⃣  Testing Patient Lookup by ABHA..."
curl -s "$API_URL/api/patients/abha/12345678901234" | jq -c '{name: (.firstName + " " + .lastName), abhaId, diagnosesCount: (.diagnoses | length)}'
echo ""

# Test 6: Get Analytics Trends
echo "6️⃣  Testing Analytics Trends..."
curl -s "$API_URL/api/analytics/trends?limit=2" | jq -c '.[] | {region, disorder, cases, trend}'
echo ""

# Test 7: Get EMR Usage
echo "7️⃣  Testing EMR Usage Stats..."
curl -s "$API_URL/api/analytics/emr-usage" | jq -c '.[] | {sector: .sectorType, adoptionRate}'
echo ""

# Test 8: Create Diagnosis
echo "8️⃣  Testing Create Diagnosis..."
PATIENT_ID=$(curl -s "$API_URL/api/patients?limit=1" | jq -r '.[0].id')
DISORDER_ID=$(curl -s "$API_URL/api/disorders?limit=1" | jq -r '.[0].id')
DOCTOR_ID="cmgsw9wcy00003vrgv12yfaqn"

DIAGNOSIS=$(curl -s -X POST "$API_URL/api/diagnoses" \
  -H "Content-Type: application/json" \
  -d "{
    \"patientId\": \"$PATIENT_ID\",
    \"disorderId\": \"$DISORDER_ID\",
    \"doctorId\": \"$DOCTOR_ID\",
    \"notes\": \"Test diagnosis from integration script\",
    \"severity\": 6,
    \"consentGiven\": true
  }" | jq -c '{id, disorder: .disorder.englishName, severity, consentGiven}')

echo "$DIAGNOSIS"
echo ""

# Test 9: Dashboard Summary
echo "9️⃣  Testing Dashboard Summary..."
curl -s "$API_URL/api/analytics/dashboard" | jq -c '.stats'
echo ""

echo "=================================="
echo "✅ API Integration Tests Complete!"
echo ""
