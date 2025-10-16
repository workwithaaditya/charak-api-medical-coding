# CHARAK API - Complete API Documentation

## Base URL
```
http://localhost:3001/api
```

## Table of Contents
1. [Authentication](#authentication)
2. [Disorders](#disorders)
3. [Patients](#patients)
4. [Diagnoses](#diagnoses)
5. [Analytics](#analytics)
6. [Health & Status](#health--status)

---

## Authentication

### Login
**POST** `/api/auth/login`

Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "username": "demodoctor",
  "password": "123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "username": "demodoctor",
    "role": "DOCTOR",
    "email": "doctor@charak.health",
    "firstName": "Dr. Aditya",
    "lastName": "Sharma"
  }
}
```

**Demo Credentials:**
- Doctor: `demodoctor` / `123`
- Government: `GovAgent` / `123`

---

## Disorders

### Search Disorders
**GET** `/api/disorders/search`

Search for disorders by name, code, or category.

**Query Parameters:**
- `query` (required): Search term
- `limit` (optional): Max results (default: 10)
- `confidence` (optional): Minimum confidence score (default: 0)

**Example:**
```
GET /api/disorders/search?query=fever&limit=5
```

**Response:**
```json
[
  {
    "id": "disorder_1",
    "englishName": "Fever",
    "sanskritName": "Jwara",
    "icd11Code": "MG50",
    "namasteCode": "N001",
    "category": "Infectious Diseases",
    "description": "Elevated body temperature due to infection or inflammation",
    "confidence": 98,
    "isActive": true
  }
]
```

### Get All Disorders
**GET** `/api/disorders`

Get list of all disorders.

**Query Parameters:**
- `category` (optional): Filter by category
- `limit` (optional): Max results (default: 50)

### Get Disorder by ID
**GET** `/api/disorders/:id`

Get detailed information about a specific disorder.

### Get Disorder by Code
**GET** `/api/disorders/code/:code`

Get disorder by ICD-11 or NAMASTE code.

**Query Parameters:**
- `type` (optional): Code type - `icd11` or `namaste` (default: icd11)

### Get Disorder Categories
**GET** `/api/disorders/categories/list`

Get list of all disorder categories.

---

## Patients

### Search Patients
**GET** `/api/patients/search`

Search for patients by name, ABHA ID, or phone.

**Query Parameters:**
- `query` (required): Search term
- `limit` (optional): Max results (default: 10)

### Get Patient by ABHA ID
**GET** `/api/patients/abha/:abhaId`

Get patient details including diagnosis history.

**Example:**
```
GET /api/patients/abha/12345678901234
```

**Response:**
```json
{
  "id": "patient_1",
  "abhaId": "12345678901234",
  "firstName": "Priya",
  "lastName": "Patel",
  "dateOfBirth": "1985-03-15T00:00:00.000Z",
  "gender": "FEMALE",
  "phone": "+91-9876543210",
  "city": "Mumbai",
  "state": "Maharashtra",
  "diagnoses": [
    {
      "id": "diagnosis_1",
      "notes": "Patient presented with high fever",
      "severity": 7,
      "diagnosedAt": "2024-09-15T00:00:00.000Z",
      "disorder": {
        "englishName": "Fever",
        "sanskritName": "Jwara",
        "icd11Code": "MG50",
        "namasteCode": "N001"
      },
      "doctor": {
        "username": "demodoctor",
        "firstName": "Dr. Aditya",
        "lastName": "Sharma"
      }
    }
  ]
}
```

### Get All Patients
**GET** `/api/patients`

Get list of all patients.

**Query Parameters:**
- `limit` (optional): Max results (default: 50)
- `offset` (optional): Pagination offset (default: 0)

### Create Patient
**POST** `/api/patients`

Create a new patient record.

**Request Body:**
```json
{
  "abhaId": "98765432109876",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "gender": "MALE",
  "phone": "+91-9999999999",
  "city": "Delhi",
  "state": "Delhi"
}
```

### Update Patient
**PUT** `/api/patients/:id`

Update patient information.

### Get Patient History
**GET** `/api/patients/:id/history`

Get patient's medical history and activity log.

**Query Parameters:**
- `limit` (optional): Max results (default: 20)

### Get Patient Statistics
**GET** `/api/patients/stats/summary`

Get summary statistics for all patients.

**Response:**
```json
{
  "totalPatients": 150,
  "totalDiagnoses": 450,
  "activePatients": 150,
  "recentDiagnoses": 25
}
```

---

## Diagnoses

### Create Diagnosis
**POST** `/api/diagnoses`

Add a new diagnosis for a patient.

**Request Body:**
```json
{
  "patientId": "patient_id",
  "disorderId": "disorder_id",
  "doctorId": "doctor_id",
  "notes": "Patient presented with symptoms...",
  "severity": 7,
  "consentGiven": true
}
```

**Response:**
```json
{
  "id": "diagnosis_1",
  "patientId": "patient_id",
  "disorderId": "disorder_id",
  "doctorId": "doctor_id",
  "notes": "Patient presented with symptoms...",
  "severity": 7,
  "consentGiven": true,
  "diagnosedAt": "2024-10-16T04:00:00.000Z",
  "disorder": { ... },
  "patient": { ... },
  "doctor": { ... }
}
```

### Get Diagnosis by ID
**GET** `/api/diagnoses/:id`

Get detailed information about a specific diagnosis.

### Update Diagnosis
**PUT** `/api/diagnoses/:id`

Update diagnosis information.

### Get Diagnoses by Patient
**GET** `/api/diagnoses/patient/:patientId`

Get all diagnoses for a specific patient.

**Query Parameters:**
- `limit` (optional): Max results (default: 20)

---

## Analytics

### Get Trend Data
**GET** `/api/analytics/trends`

Get anonymized analytics trend data.

**Query Parameters:**
- `period` (optional): Filter by time period (e.g., "2024-Q3")
- `limit` (optional): Max results (default: 100)

**Response:**
```json
[
  {
    "id": "analytics_1",
    "region": "North India",
    "state": "Delhi",
    "disorder": "Respiratory Issues",
    "ageGroup": "25-40",
    "gender": "MALE",
    "cases": 1250,
    "trend": "INCREASING",
    "period": "2024-Q3"
  }
]
```

### Get EMR Usage Statistics
**GET** `/api/analytics/emr-usage`

Get EMR system adoption statistics.

**Query Parameters:**
- `sectorType` (optional): Filter by sector (e.g., "Public Hospitals")
- `region` (optional): Filter by region

**Response:**
```json
[
  {
    "id": "emr_1",
    "sectorType": "Public Hospitals",
    "region": "All India",
    "totalCenters": 1000,
    "adoptedCenters": 850,
    "adoptionRate": 85.0,
    "month": "2024-09"
  }
]
```

### Get Disease Analytics
**GET** `/api/analytics/disease/:disorderName`

Get detailed analytics for a specific disorder.

**Example:**
```
GET /api/analytics/disease/Diabetes
```

**Response:**
```json
{
  "disorder": "Diabetes",
  "totalCases": 5420,
  "regionalDistribution": {
    "North India": 1850,
    "South India": 1520,
    "West India": 1340,
    "East India": 710
  },
  "detailedData": [ ... ]
}
```

### Get API Usage Statistics
**GET** `/api/analytics/api-usage`

Get API usage logs and statistics.

**Query Parameters:**
- `endpoint` (optional): Filter by endpoint
- `limit` (optional): Max results (default: 100)

### Get Dashboard Summary
**GET** `/api/analytics/dashboard`

Get summary statistics for dashboard.

**Response:**
```json
{
  "stats": {
    "totalPatients": 150,
    "totalDisorders": 50,
    "totalDiagnoses": 450,
    "totalUsers": 10
  },
  "recentDiagnoses": [ ... ]
}
```

---

## Health & Status

### Health Check
**GET** `/api/health`

Check API server status.

**Response:**
```json
{
  "status": "OK",
  "message": "CHARAK API Backend is running",
  "timestamp": "2024-10-16T04:00:00.000Z"
}
```

### Database Test
**GET** `/api/db-test`

Test database connection and get basic stats.

**Response:**
```json
{
  "status": "Database Connected",
  "stats": {
    "users": 2,
    "disorders": 10,
    "patients": 3
  },
  "timestamp": "2024-10-16T04:00:00.000Z"
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## Code Examples

### JavaScript/Node.js
```javascript
// Login
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'demodoctor',
    password: '123'
  })
});
const data = await response.json();
console.log(data.token);

// Search disorders
const disorders = await fetch(
  'http://localhost:3001/api/disorders/search?query=fever'
).then(r => r.json());
```

### Python
```python
import requests

# Login
response = requests.post(
    'http://localhost:3001/api/auth/login',
    json={'username': 'demodoctor', 'password': '123'}
)
token = response.json()['token']

# Search disorders
disorders = requests.get(
    'http://localhost:3001/api/disorders/search',
    params={'query': 'fever'}
).json()
```

### cURL
```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demodoctor","password":"123"}'

# Search disorders
curl "http://localhost:3001/api/disorders/search?query=fever"

# Create diagnosis
curl -X POST http://localhost:3001/api/diagnoses \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "patient_id",
    "disorderId": "disorder_id",
    "doctorId": "doctor_id",
    "notes": "Test diagnosis",
    "severity": 5,
    "consentGiven": true
  }'
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production use, consider implementing:
- Request rate limits per IP/user
- API key authentication
- Request throttling

## Authentication

For production use, implement:
- JWT token authentication for protected endpoints
- Token refresh mechanism
- Secure password hashing with bcrypt
- Role-based access control (RBAC)

## Best Practices

1. Always handle errors appropriately
2. Use HTTPS in production
3. Validate and sanitize all inputs
4. Implement proper logging
5. Use environment variables for configuration
6. Implement proper CORS policies
7. Add request validation middleware
8. Use database transactions for related operations

---

## Support

For issues or questions:
- Check the API health endpoint: `/api/health`
- Review server logs for detailed error messages
- Verify database connectivity: `/api/db-test`

**Last Updated:** October 16, 2024
