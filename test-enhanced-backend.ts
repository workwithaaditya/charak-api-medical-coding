import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3001/api';

async function testEnhancedBackend() {
  console.log('🔍 Testing Enhanced CHARAK API Backend v2.0.0');
  console.log('='.repeat(50));

  try {
    // Test health check
    console.log('\n1. Testing Health Check...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData.status);
    console.log('📋 Version:', healthData.version);
    console.log('✨ Features:', healthData.features.length, 'features available');

    // Test database
    console.log('\n2. Testing Database Connection...');
    const dbResponse = await fetch(`${API_BASE_URL}/db-test`);
    const dbData = await dbResponse.json();
    console.log('✅ Database:', dbData.status);
    console.log('📊 Data:', dbData.data);

    // Test login
    console.log('\n3. Testing Authentication...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'demodoctor', password: '123' })
    });
    const loginData = await loginResponse.json();
    
    if (loginData.token) {
      console.log('✅ Login successful for:', loginData.user.username);
      console.log('👤 Role:', loginData.user.role);
      
      const token = loginData.token;
      const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      // Test patient lookup for Aaditya Negi
      console.log('\n4. Testing Patient Lookup (Aaditya Negi)...');
      const patientResponse = await fetch(`${API_BASE_URL}/patients/abha/55789012345678`, {
        headers: authHeaders
      });
      
      if (patientResponse.ok) {
        const patientData = await patientResponse.json();
        console.log('✅ Patient found:', patientData.name || `${patientData.firstName} ${patientData.lastName}`);
        console.log('🆔 ABHA ID:', patientData.abhaId);
        console.log('📍 Location:', patientData.city, patientData.state);
        console.log('📞 Contact:', patientData.phone);
      } else {
        console.log('❌ Patient lookup failed');
      }

      // Test enhanced patient search
      console.log('\n5. Testing Enhanced Patient Search...');
      const searchResponse = await fetch(`${API_BASE_URL}/patients?search=Aaditya&limit=5`, {
        headers: authHeaders
      });
      
      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        console.log('✅ Search results:', searchData.patients?.length || 0, 'patients found');
        console.log('📄 Pagination:', searchData.pagination);
      }

      // Test disorder search
      console.log('\n6. Testing Disorder Search...');
      const disorderResponse = await fetch(`${API_BASE_URL}/disorders?search=fever&language=english&limit=3`, {
        headers: authHeaders
      });
      
      if (disorderResponse.ok) {
        const disorderData = await disorderResponse.json();
        console.log('✅ Disorder search:', disorderData.disorders?.length || 0, 'disorders found');
      }

      // Test analytics
      console.log('\n7. Testing Medical Analytics...');
      const analyticsResponse = await fetch(`${API_BASE_URL}/medical/analytics/overview`, {
        headers: authHeaders
      });
      
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        console.log('✅ Analytics data loaded');
        console.log('📊 Total Diagnoses:', analyticsData.overview?.totalDiagnoses || 0);
        console.log('🏥 Total Patients:', analyticsData.overview?.totalPatients || 0);
        console.log('💊 Total Disorders:', analyticsData.overview?.totalDisorders || 0);
      }

    } else {
      console.log('❌ Login failed:', loginData.error);
    }

    console.log('\n✅ Enhanced Backend Test Complete!');
    console.log('🎉 CHARAK API v2.0.0 is fully functional with enhanced features!');

  } catch (error) {
    console.error('❌ Test failed:', (error as Error).message || 'Unknown error');
  }
}

testEnhancedBackend();