// Cloudflare Worker for Circle K App Backend
// Handles money tracking and bug reports

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      if (url.pathname === '/api/prices') {
        // Get current prices
        if (request.method === 'GET') {
          const prices = {
            chips: 4.99,
            candy: 3.49,
            alani: 5.99,
            arizona: 2.99,
            froster: 3.99
          };
          return new Response(JSON.stringify(prices), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }

      if (url.pathname === '/api/redeemed') {
        // Handle redeemed items
        if (request.method === 'GET') {
          const redeemed = await env.REDEEMED.get('redeemed_items') || '[]';
          return new Response(redeemed, {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        if (request.method === 'POST') {
          const data = await request.json();
          const current = await env.REDEEMED.get('redeemed_items') || '[]';
          const redeemed = JSON.parse(current);
          redeemed.push(data);
          await env.REDEEMED.put('redeemed_items', JSON.stringify(redeemed));
          
          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }

      if (url.pathname === '/api/reset') {
        // Reset redeemed items
        if (request.method === 'POST') {
          await env.REDEEMED.put('redeemed_items', '[]');
          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }

      if (url.pathname === '/api/status') {
        // Handle working status
        if (request.method === 'GET') {
          const status = await env.STATUS.get('working_status') || '{"status":"working","timestamp":"2025-12-08T00:00:00.000Z"}';
          return new Response(status, {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        if (request.method === 'POST') {
          const data = await request.json();
          const statusData = {
            status: data.status,
            timestamp: data.timestamp || new Date().toISOString()
          };
          await env.STATUS.put('working_status', JSON.stringify(statusData));
          
          return new Response(JSON.stringify({ 
            success: true, 
            status: statusData 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }

      if (url.pathname === '/api/bugs') {
        // Handle bug reports
        if (request.method === 'GET') {
          const bugs = await env.BUGS.get('bug_reports') || '[]';
          return new Response(bugs, {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        if (request.method === 'POST') {
          const data = await request.json();
          const current = await env.BUGS.get('bug_reports') || '[]';
          const bugs = JSON.parse(current);
          bugs.push(data);
          await env.BUGS.put('bug_reports', JSON.stringify(bugs));
          
          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }

      if (url.pathname === '/api/money-saved') {
        // Calculate total money saved
        if (request.method === 'GET') {
          const redeemed = await env.REDEEMED.get('redeemed_items') || '[]';
          const redeemedItems = JSON.parse(redeemed);
          
          const prices = {
            chips: 4.99,
            candy: 3.49,
            alani: 5.99,
            arizona: 2.99,
            froster: 3.99
          };
          
          let totalSaved = 0;
          redeemedItems.forEach(item => {
            if (prices[item]) {
              totalSaved += prices[item];
            }
          });
          
          return new Response(JSON.stringify({ 
            totalSaved: totalSaved,
            redeemedItems: redeemedItems 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }

      // Serve static files from your GitHub repo or other hosting
      if (url.pathname === '/' || url.pathname === '/index.html') {
        return new Response(getIndexHTML(), {
          headers: { ...corsHeaders, 'Content-Type': 'text/html' }
        });
      }

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response('Not Found', { status: 404 });
  }
};

function getIndexHTML() {
  return `<!DOCTYPE html>
<html>
<head>
    <title>Circle K App API</title>
</head>
<body>
    <h1>Circle K App API</h1>
    <p>API Endpoints:</p>
    <ul>
        <li><strong>GET /api/prices</strong> - Get current prices</li>
        <li><strong>GET /api/redeemed</strong> - Get redeemed items</li>
        <li><strong>POST /api/redeemed</strong> - Add redeemed item</li>
        <li><strong>POST /api/reset</strong> - Reset all redeemed items</li>
        <li><strong>GET /api/money-saved</strong> - Get total money saved</li>
        <li><strong>GET /api/bugs</strong> - Get bug reports</li>
        <li><strong>POST /api/bugs</strong> - Submit bug report</li>
    </ul>
</body>
</html>`;
}
