const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://aflmtzzctqfermxsfwnp.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmbG10enpjdHFmZXJteHNmd25wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzM3MDA1OCwiZXhwIjoyMTAyOTQ2MDU4fQ.5bv3S0uCMQrz8dUlh6ZE8a1dysnm3wLGfxk9mufq3gQ';
const USER_ID = '8157ad67-6f6e-4e25-ab45-8bcba03a7647';

const admin = createClient(SUPABASE_URL, SERVICE_KEY);

async function testInsert() {
  console.log('Inserting a test trip directly via service role (bypassing RLS)...');
  const { data, error } = await admin.from('trips').insert({
    owner_id: USER_ID,
    title: 'Test Trip - Goa',
    description: 'A beautiful beach trip to Goa',
    start_date: '2026-10-01',
    end_date: '2026-10-07',
    total_budget: 50000,
    status: 'planning',
    cover_image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&h=500&q=80'
  }).select().single();

  if (error) {
    console.log('INSERT ERROR:', error.message, error.code);
  } else {
    console.log('INSERTED SUCCESSFULLY:', data.id, data.title);
    console.log('Full row:', JSON.stringify(data, null, 2));
  }
}

testInsert().catch(console.error);
