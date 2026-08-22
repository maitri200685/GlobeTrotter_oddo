import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// This test requires a live Supabase instance with RLS enabled
describe.skip('Row Level Security (RLS) Tests', () => {
  const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:54321';
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'anon-key';
  
  // Note: These tokens must correspond to two different users (User A and User B) in the local DB.
  const userAToken = process.env.TEST_USER_A_TOKEN || '';
  const userBToken = process.env.TEST_USER_B_TOKEN || '';
  let tripIdUserA = '';

  it('User A can create a trip', async () => {
    const supabaseA = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${userAToken}` } }
    });

    const { data, error } = await supabaseA
      .from('trips')
      .insert({ title: 'User A Trip', visibility: 'private' })
      .select('id')
      .single();

    expect(error).toBeNull();
    expect(data?.id).toBeDefined();
    tripIdUserA = data!.id;
  });

  it('User A can access User A trip', async () => {
    const supabaseA = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${userAToken}` } }
    });

    const { data, error } = await supabaseA
      .from('trips')
      .select('*')
      .eq('id', tripIdUserA)
      .single();

    expect(error).toBeNull();
    expect(data?.id).toBe(tripIdUserA);
  });

  it('User B cannot access User A private trip', async () => {
    const supabaseB = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${userBToken}` } }
    });

    const { data, error } = await supabaseB
      .from('trips')
      .select('*')
      .eq('id', tripIdUserA)
      .single();

    // RLS should completely hide the row, PGRST116 means zero rows found
    expect(error).toBeDefined();
    expect(error?.code).toBe('PGRST116');
    expect(data).toBeNull();
  });

  it('User B cannot modify User A private trip', async () => {
    const supabaseB = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${userBToken}` } }
    });

    const { data, error } = await supabaseB
      .from('trips')
      .update({ title: 'Hacked Title' })
      .eq('id', tripIdUserA)
      .select();

    // Update should apply to 0 rows
    expect(data?.length).toBe(0);
  });
});
