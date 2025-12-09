import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Connect to Supabase
export const supabase = createClient(
  "https://hbqermjuktzmtymnzlda.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicWVybWp1a3R6bXR5bW56bGRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTcxMjQsImV4cCI6MjA4MDg3MzEyNH0.vUlgCOR1xjU6nQswLw6VUZATGVkRk5qKOdWNPRXQ2Fo"
);

// Get the current total
export async function getTotalSaved() {
  const { data, error } = await supabase
    .from("totals")
    .select("total_saved")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("Error loading total:", error);
    return 0;
  }

  return Number(data.total_saved);
}

// Add money to total
export async function addToTotal(amount) {
  const current = await getTotalSaved();
  const newTotal = current + amount;

  const { error } = await supabase
    .from("totals")
    .update({ total_saved: newTotal, updated_at: new Date() })
    .eq("id", 1);

  if (error) {
    console.error("Error updating total:", error);
    return current;
  }

  return newTotal;
}

// Reset total to 0
export async function resetTotal() {
  await supabase
    .from("totals")
    .update({ total_saved: 0, updated_at: new Date() })
    .eq("id", 1);

  return 0;
}
