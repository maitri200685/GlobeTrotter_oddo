const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://aflmtzzctqfermxsfwnp.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmbG10enpjdHFmZXJteHNmd25wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzM3MDA1OCwiZXhwIjoyMTAyOTQ2MDU4fQ.5bv3S0uCMQrz8dUlh6ZE8a1dysnm3wLGfxk9mufq3gQ';
const USER_ID = '8157ad67-6f6e-4e25-ab45-8bcba03a7647';

const admin = createClient(SUPABASE_URL, SERVICE_KEY);

async function diagnose() {
  console.log('=== 1. ALL TRIPS IN DB (admin) ===');
  const { data: allTrips, error: e1 } = await admin.from('trips').select('id, title, owner_id, status, created_at');
  if (e1) console.log('ERROR:', e1.message);
  else console.log('Total trips in DB:', allTrips.length, allTrips);

  console.log('\n=== 2. TRIPS FOR USER', USER_ID, '===');
  const { data: userTrips, error: e2 } = await admin.from('trips').select('id, title, owner_id, status').eq('owner_id', USER_ID);
  if (e2) console.log('ERROR:', e2.message);
  else console.log('User trips:', userTrips.length, userTrips);

  console.log('\n=== 3. HEALTH CHECK - backend API ===');
  try {
    const res = await fetch('http://localhost:5000/api/v1/health');
    const data = await res.json();
    console.log('Backend health:', res.status, JSON.stringify(data));
  } catch (err) {
    console.log('Backend unreachable:', err.message);
  }

  console.log('\n=== 4. TRIPS API with no auth (expect 401) ===');
  try {
    const res = await fetch('http://localhost:5000/api/v1/trips');
    const data = await res.json();
    console.log('Trips (no auth):', res.status, JSON.stringify(data).substring(0, 200));
  } catch (err) {
    console.log('Error:', err.message);
  }
}

diagnose().catch(console.error);
