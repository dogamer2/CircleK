export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS support
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // or "https://tryastra.xyz"
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    // Handle OPTIONS (CORS preflight)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // Helper to respond with CORS headers
    const respond = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });

    // -----------------------------
    // GET TOTAL MONEY SAVED
    // -----------------------------
    if (url.pathname === "/api/money-saved") {
      const redeemed = await env.REDEEMED.get("items", { type: "json" }) || {};
      let total = 0;

      const prices = {
        chips: 1.99,
        candy: 3.29,
        alani: 3.99,
        arizona: 2.19,
        froster: 1.69,
      };

      for (const item of Object.keys(redeemed)) {
        total += (prices[item] || 0) * redeemed[item];
      }

      return respond({
        totalSaved: total,
        redeemedItems: redeemed
      });
    }

    // -----------------------------
    // SAVE A BUG REPORT
    // -----------------------------
    if (url.pathname === "/api/bugs" && request.method === "POST") {
      const body = await request.json();
      const existing = await env.BUGS.get("all", { type: "json" }) || [];

      existing.push(body);
      await env.BUGS.put("all", JSON.stringify(existing));

      return respond({ success: true, saved: body });
    }

    // -----------------------------
    // GET ALL BUG REPORTS
    // -----------------------------
    if (url.pathname === "/api/bugs") {
      const reports = await env.BUGS.get("all", { type: "json" }) || [];
      return respond(reports);
    }

    // -----------------------------
    // UPDATE STATUS
    // -----------------------------
    if (url.pathname === "/api/status" && request.method === "POST") {
      const body = await request.json();
      await env.STATUS.put("current", JSON.stringify(body));

      return respond({ success: true, status: body });
    }

    // -----------------------------
    // GET STATUS
    // -----------------------------
    if (url.pathname === "/api/status") {
      const status = await env.STATUS.get("current", { type: "json" }) || {
        status: "working",
        timestamp: new Date().toISOString()
      };
      return respond(status);
    }

    // DEFAULT RESPONSE
    return new Response("CircleK API — Online", { 
      status: 200,
      headers: corsHeaders
    });
  }
};
