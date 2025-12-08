// --- Frontend JS for Circle K API ---
const API_BASE = 'https://circlek.amongustest2020.workers.dev/api';

// Prices for each product
const prices = { chips:1.99, candy:3.29, alani:3.99, arizona:2.19, froster:1.69 };

// Keep local array of redeemed items
let redeemedItems = [];

// Load money saved from KV via API
async function loadMoneySaved() {
  try {
    const res = await fetch(`${API_BASE}/money-saved`);
    const data = await res.json();
    redeemedItems = data.redeemedItems || [];
    document.getElementById('savedAmount').textContent = `$${(data.totalSaved || 0).toFixed(2)}`;
    console.log('Money loaded from KV:', data);
  } catch (err) {
    console.error('Failed to fetch money saved:', err);
    document.getElementById('savedAmount').textContent = '$0.00';
  }
}

// Redeem an item
async function redeemItem(itemKey) {
  if (!prices[itemKey]) return alert('Invalid item');
  redeemedItems.push(itemKey);
  await saveRedeemedItems();
  loadMoneySaved();
  console.log('Redeemed:', itemKey);
}

// Save redeemed items to KV
async function saveRedeemedItems() {
  try {
    await fetch(`${API_BASE}/money-saved`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ redeemedItems })
    });
    console.log('Saved redeemed items to KV');
  } catch (err) {
    console.error('Failed to save redeemed items:', err);
  }
}

// Get working status from KV
async function loadStatus() {
  try {
    const res = await fetch(`${API_BASE}/status`);
    const data = await res.json();
    const statusEl = document.querySelector('.status-info');
    statusEl.textContent = data.working ? 'Circle K working ✅' : 'Circle K may not be working ⚠️';
  } catch (err) {
    console.error('Failed to load status:', err);
  }
}

// Set working status
async function setStatus(working) {
  try {
    await fetch(`${API_BASE}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: working ? 'working' : 'not_working' })
    });
    await loadStatus();
  } catch (err) {
    console.error('Failed to set status:', err);
  }
}

// Debug function: prints current KV state
function debugKV() {
  console.log('Redeemed items:', redeemedItems);
}

// On page load, fetch initial data
document.addEventListener('DOMContentLoaded', () => {
  loadMoneySaved();
  loadStatus();
});
