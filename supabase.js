// supabase.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ---------- CONFIG (from you) ----------
const SUPABASE_URL = "https://hbqermjuktzmtymnzlda.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicWVybWp1a3R6bXR5bW56bGRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTcxMjQsImV4cCI6MjA4MDg3MzEyNH0.vUlgCOR1xjU6nQswLw6VUZATGVkRk5qKOdWNPRXQ2Fo";

// ---------- CLIENT ----------
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: { params: { enable_all: true } }
});

// ---------- TOTALS (single-row) ----------
export async function getTotalSaved() {
  try {
    const { data, error } = await supabase
      .from('totals')
      .select('total_saved')
      .eq('id', 1)
      .single();
    if (error) throw error;
    return Number(data.total_saved || 0);
  } catch (err) {
    console.error('getTotalSaved error:', err);
    // fallback to localStorage value if available
    return Number(localStorage.getItem('totalSavedFallback') || 0);
  }
}

// Add to total (naive read+update; concurrent edits are rare here)
export async function addToTotal(amount) {
  try {
    // fetch current
    const current = await getTotalSaved();
    const newTotal = Number(current) + Number(amount);

    const { error } = await supabase
      .from('totals')
      .update({ total_saved: newTotal, updated_at: new Date().toISOString() })
      .eq('id', 1);

    if (error) throw error;

    // Return new total
    return newTotal;
  } catch (err) {
    console.error('addToTotal error:', err);
    // fallback local
    const local = Number(localStorage.getItem('totalSavedFallback') || '0');
    const next = local + Number(amount);
    localStorage.setItem('totalSavedFallback', String(next));
    return next;
  }
}

export async function resetTotal() {
  try {
    const { error } = await supabase
      .from('totals')
      .update({ total_saved: 0, updated_at: new Date().toISOString() })
      .eq('id', 1);
    if (error) throw error;
    localStorage.setItem('totalSavedFallback', '0');
    return 0;
  } catch (err) {
    console.error('resetTotal error:', err);
    localStorage.setItem('totalSavedFallback', '0');
    return 0;
  }
}

// ---------- BUG REPORTS ----------
export async function submitBugReport({ name = 'Anonymous', type, description }) {
  try {
    const { error } = await supabase
      .from('bug_reports')
      .insert([{ name, type, description }]);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('submitBugReport error:', err);
    throw err;
  }
}

export async function fetchBugReports() {
  try {
    const { data, error } = await supabase
      .from('bug_reports')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(200);
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('fetchBugReports error:', err);
    // fallback local
    return JSON.parse(localStorage.getItem('bugReports') || '[]');
  }
}

// ---------- STATUS REPORTS ----------
export async function submitStatusReport(status) {
  try {
    const { error } = await supabase
      .from('status_reports')
      .insert([{ status }]);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('submitStatusReport error:', err);
    throw err;
  }
}

export async function fetchLatestStatus() {
  try {
    const { data, error } = await supabase
      .from('status_reports')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();
    if (error && error.code !== 'PGRST116') throw error; // allow no data
    return data || null;
  } catch (err) {
    console.error('fetchLatestStatus error:', err);
    // fallback local
    const lastChange = localStorage.getItem('lastStatusChange');
    const circleKWorking = localStorage.getItem('circleKWorking');
    if (lastChange) {
      return { status: circleKWorking === 'false' ? 'not working' : 'working', timestamp: lastChange };
    }
    return null;
  }
}

// ---------- SUBSCRIPTIONS (realtime) ----------
// Subscribe to changes on totals table (UPDATE)
export function subscribeToTotals(callback) {
  try {
    const chan = supabase.channel('public:totals')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'totals' }, (payload) => {
        callback(payload);
      })
      .subscribe();
    return () => supabase.removeChannel(chan);
  } catch (err) {
    console.error('subscribeToTotals error:', err);
    return () => {};
  }
}

// Subscribe to bug_reports (INSERT)
export function subscribeToBugReports(callback) {
  try {
    const chan = supabase.channel('public:bug_reports')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bug_reports' }, (payload) => {
        callback(payload);
      })
      .subscribe();
    return () => supabase.removeChannel(chan);
  } catch (err) {
    console.error('subscribeToBugReports error:', err);
    return () => {};
  }
}

// Subscribe to status_reports (INSERT)
export function subscribeToStatusReports(callback) {
  try {
    const chan = supabase.channel('public:status_reports')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'status_reports' }, (payload) => {
        callback(payload);
      })
      .subscribe();
    return () => supabase.removeChannel(chan);
  } catch (err) {
    console.error('subscribeToStatusReports error:', err);
    return () => {};
  }
}
export async function verifyCode(code) {
  const { data, error } = await supabase
    .from('access_codes')
    .select('*')
    .eq('code', code)
    .eq('used', false)
    .single();

  return data;
}
export async function markCodeUsed(code) {
  return await supabase
    .from('access_codes')
    .update({ used: true })
    .eq('code', code);
}
export async function generateCode(code) {
  return await supabase
    .from('access_codes')
    .insert([{ code }]);
}
