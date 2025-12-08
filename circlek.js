const savedAmountEl = document.getElementById('savedAmount');

async function loadMoneySaved() {
try {
const response = await fetch('https://circlek.amongustest2020.workers.dev/api/money-saved', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
});


```
if (!response.ok) throw new Error(`API error: ${response.status}`);

const data = await response.json();
const { totalSaved, redeemedItems } = data;

savedAmountEl.textContent = `$${totalSaved.toFixed(2)}`;
console.log('Money loaded from KV:', data);
```

} catch (err) {
console.warn('API not available, falling back to localStorage:', err);

```
const redeemedItems = JSON.parse(localStorage.getItem('redeemedItems') || '[]');

const prices = {
  chips: 1.99,
  candy: 3.29,
  alani: 3.99,
  arizona: 2.19,
  froster: 1.69
};

const totalSaved = redeemedItems.reduce((sum, item) => sum + (prices[item] || 0), 0);

savedAmountEl.textContent = `$${totalSaved.toFixed(2)}`;
console.log('Money loaded from localStorage:', totalSaved, 'Redeemed items:', redeemedItems);
```

}
}

// Call on page load
document.addEventListener('DOMContentLoaded', loadMoneySaved);
