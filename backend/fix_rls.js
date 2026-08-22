const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://aflmtzzctqfermxsfwnp.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmbG10enpjdHFmZXJteHNmd25wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzM3MDA1OCwiZXhwIjoyMTAyOTQ2MDU4fQ.5bv3S0uCMQrz8dUlh6ZE8a1dysnm3wLGfxk9mufq3gQ';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function fixRLS() {
  const statements = [
    'DROP POLICY IF EXISTS "Trip members viewable by trip participants or if public" ON trip_members',
    'DROP POLICY IF EXISTS "Only owners can manage trip members" ON trip_members',
    `CREATE POLICY "Trip members viewable by owner or self" ON trip_members FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_id AND trips.owner_id = auth.uid()) OR EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_id AND trips.visibility = 'public'))`,
    `CREATE POLICY "Only owners can insert trip members" ON trip_members FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_id AND trips.owner_id = auth.uid()))`,
    `CREATE POLICY "Only owners can update trip members" ON trip_members FOR UPDATE USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_id AND trips.owner_id = auth.uid()))`,
    `CREATE POLICY "Only owners can delete trip members" ON trip_members FOR DELETE USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_id AND trips.owner_id = auth.uid()))`,
  ];

  for (const stmt of statements) {
    console.log('Running:', stmt.substring(0, 70) + '...');
    const res = await fetch(SUPABASE_URL + '/rest/v1/rpc/exec_sql', {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': 'Bearer ' + SERVICE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql: stmt })
    });
    const data = await res.text();
    console.log('Response:', res.status, data.substring(0, 200));
  }
}

fixRLS().catch(console.error);
