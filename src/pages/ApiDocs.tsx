import React, { useState } from 'react';

interface CodeExample {
  language: string;
  code: string;
}

const ApiDocs: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string>('');

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const endpoints = [
    {
      method: 'GET',
      path: '/api/search/disorders',
      description: 'Search for medical disorders with English/Sanskrit terms',
      params: ['query: string', 'limit: number (optional)', 'confidence: number (optional)'],
      response: 'Array of disorder objects with ICD-11 and NAMASTE codes'
    },
    {
      method: 'POST',
      path: '/api/patients/history',
      description: 'Retrieve patient medical history using ABHA ID',
      params: ['abha_id: string', 'date_range: object (optional)'],
      response: 'Patient history array with coded diagnoses'
    },
    {
      method: 'POST',
      path: '/api/diagnoses/add',
      description: 'Add new diagnosis to patient record',
      params: ['abha_id: string', 'disorder_id: string', 'consent: boolean'],
      response: 'Success status and updated record ID'
    },
    {
      method: 'GET',
      path: '/api/analytics/trends',
      description: 'Get disease trend analytics by region/demographic',
      params: ['disorder: string', 'region: string (optional)', 'timeframe: string'],
      response: 'Trend data with statistics and visualizations'
    }
  ];

  const codeExamples: Record<string, CodeExample[]> = {
    javascript: [
      {
        language: 'JavaScript (Fetch)',
        code: `// Search for disorders
const searchDisorders = async (query) => {
  const response = await fetch('/api/search/disorders', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    params: new URLSearchParams({ query, limit: 10 })
  });
  
  const data = await response.json();
  return data;
};

// Add diagnosis with consent
const addDiagnosis = async (abhaId, disorderId) => {
  const response = await fetch('/api/diagnoses/add', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      abha_id: abhaId,
      disorder_id: disorderId,
      consent: true
    })
  });
  
  return await response.json();
};`
      }
    ],
    python: [
      {
        language: 'Python (requests)',
        code: `import requests
import json

class CharakAPI:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://api.charak.health"
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
    
    def search_disorders(self, query, limit=10):
        """Search for medical disorders"""
        params = {"query": query, "limit": limit}
        response = requests.get(
            f"{self.base_url}/api/search/disorders",
            headers=self.headers,
            params=params
        )
        return response.json()
    
    def get_patient_history(self, abha_id):
        """Get patient medical history"""
        data = {"abha_id": abha_id}
        response = requests.post(
            f"{self.base_url}/api/patients/history",
            headers=self.headers,
            json=data
        )
        return response.json()
    
    def add_diagnosis(self, abha_id, disorder_id):
        """Add diagnosis to patient record"""
        data = {
            "abha_id": abha_id,
            "disorder_id": disorder_id,
            "consent": True
        }
        response = requests.post(
            f"{self.base_url}/api/diagnoses/add",
            headers=self.headers,
            json=data
        )
        return response.json()

# Usage example
api = CharakAPI("your_api_key_here")
results = api.search_disorders("fever")`
      }
    ],
    java: [
      {
        language: 'Java (OkHttp)',
        code: `import okhttp3.*;
import com.google.gson.Gson;
import java.io.IOException;

public class CharakAPIClient {
    private final OkHttpClient client;
    private final String baseUrl = "https://api.charak.health";
    private final String apiKey;
    private final Gson gson = new Gson();
    
    public CharakAPIClient(String apiKey) {
        this.client = new OkHttpClient();
        this.apiKey = apiKey;
    }
    
    public String searchDisorders(String query, int limit) throws IOException {
        HttpUrl url = HttpUrl.parse(baseUrl + "/api/search/disorders")
            .newBuilder()
            .addQueryParameter("query", query)
            .addQueryParameter("limit", String.valueOf(limit))
            .build();
            
        Request request = new Request.Builder()
            .url(url)
            .addHeader("Authorization", "Bearer " + apiKey)
            .addHeader("Content-Type", "application/json")
            .build();
            
        try (Response response = client.newCall(request).execute()) {
            return response.body().string();
        }
    }
    
    public String addDiagnosis(String abhaId, String disorderId) throws IOException {
        String json = gson.toJson(new DiagnosisRequest(abhaId, disorderId, true));
        
        RequestBody body = RequestBody.create(
            json, 
            MediaType.get("application/json; charset=utf-8")
        );
        
        Request request = new Request.Builder()
            .url(baseUrl + "/api/diagnoses/add")
            .addHeader("Authorization", "Bearer " + apiKey)
            .post(body)
            .build();
            
        try (Response response = client.newCall(request).execute()) {
            return response.body().string();
        }
    }
}

class DiagnosisRequest {
    String abha_id;
    String disorder_id;
    boolean consent;
    
    public DiagnosisRequest(String abhaId, String disorderId, boolean consent) {
        this.abha_id = abhaId;
        this.disorder_id = disorderId;
        this.consent = consent;
    }
}`
      }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="medical-card mb-8 p-8">
        <h1 className="text-3xl font-bold text-medical-primary mb-4">CHARAK API Documentation</h1>
        <p className="text-gray-600 text-lg">
          Comprehensive medical coding API bridging traditional Ayurvedic medicine with modern healthcare standards.
          Access dual coding systems (ICD-11 & NAMASTE) with intelligent search capabilities.
        </p>
      </div>

      {/* Authentication Section */}
      <div className="medical-card mb-8 p-6">
        <h2 className="text-2xl font-bold text-medical-primary mb-4">Authentication</h2>
        <p className="text-gray-600 mb-4">
          All API requests require authentication using API keys. Include your API key in the Authorization header:
        </p>
        <div className="bg-gray-100 p-4 rounded-md font-mono text-sm">
          Authorization: Bearer YOUR_API_KEY
        </div>
      </div>

      {/* Endpoints Section */}
      <div className="medical-card mb-8 p-6">
        <h2 className="text-2xl font-bold text-medical-primary mb-6">API Endpoints</h2>
        <div className="space-y-6">
          {endpoints.map((endpoint, index) => (
            <div key={index} className="border-l-4 border-medical-primary pl-6 py-4">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-md text-sm font-bold ${
                  endpoint.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {endpoint.method}
                </span>
                <code className="font-mono text-lg">{endpoint.path}</code>
              </div>
              <p className="text-gray-600 mb-3">{endpoint.description}</p>
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="font-semibold text-sm mb-2">Parameters:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {endpoint.params.map((param, paramIndex) => (
                    <li key={paramIndex} className="font-mono">• {param}</li>
                  ))}
                </ul>
                <h4 className="font-semibold text-sm mt-3 mb-2">Response:</h4>
                <p className="text-sm text-gray-600">{endpoint.response}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Code Examples Section */}
      <div className="medical-card p-6">
        <h2 className="text-2xl font-bold text-medical-primary mb-6">Integration Examples</h2>
        
        <div className="space-y-8">
          {Object.entries(codeExamples).map(([lang, examples]) => (
            <div key={lang}>
              <h3 className="text-xl font-semibold text-medical-dark mb-4 capitalize">{lang}</h3>
              {examples.map((example, index) => (
                <div key={index} className="bg-gray-900 rounded-lg overflow-hidden">
                  <div className="flex justify-between items-center bg-gray-800 px-4 py-2">
                    <span className="text-gray-300 text-sm font-medium">{example.language}</span>
                    <button
                      onClick={() => copyToClipboard(example.code, `${lang}-${index}`)}
                      className="text-gray-300 hover:text-white text-sm font-medium flex items-center gap-1"
                    >
                      {copiedCode === `${lang}-${index}` ? (
                        <>✓ Copied!</>
                      ) : (
                        <>📋 Copy</>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 text-green-400 text-sm overflow-x-auto">
                    <code>{example.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Response Format Section */}
      <div className="medical-card mt-8 p-6">
        <h2 className="text-2xl font-bold text-medical-primary mb-4">Response Formats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Disorder Search Response</h3>
            <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
{`{
  "results": [
    {
      "id": "d001",
      "english": "Fever",
      "sanskrit": "Jwara",
      "icd11": "MG50",
      "namaste": "N001",
      "confidence": 98,
      "category": "Infectious"
    }
  ],
  "total": 1,
  "page": 1
}`}
            </pre>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Patient History Response</h3>
            <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
{`{
  "patient": {
    "abha_id": "12345678",
    "history": [
      {
        "date": "2024-09-15",
        "disorder": {
          "english": "Fever",
          "sanskrit": "Jwara",
          "codes": {
            "icd11": "MG50",
            "namaste": "N001"
          }
        }
      }
    ]
  }
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;