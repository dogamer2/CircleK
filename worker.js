export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS Headers
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    // Helper function
    const json = (data, code = 200) =>
      new Response(JSON.stringify(data), {
        status: code,
        headers: { "Content-Type": "application/json", ...cors },
      });

    // -----------------------------
    // GET MONEY SAVED
    // -----------------------------
    if (url.pathname === "/api/money-saved") {
      const redeemed = await env.REDEEMED.get("items", { type: "json" }) || {};

      const prices = {
        chips: 1.99,
        candy: 3.29,
        alani: 3.99,
        arizona: 2.19,
        froster: 1.69,
      };

      let total = 0;
      for (const item of Object.keys(redeemed)) {
        total += (prices[item] || 0) * redeemed[item];
      }

      return json({ totalSaved: total, redeemedItems: redeemed });
    }

    // -----------------------------
    // SAVE BUG REPORT
    // -----------------------------
    if (url.pathname === "/api/bugs" && request.method === "POST") {
      const body = await request.json();
      const existing = await env.BUGS.get("all", { type: "json" }) || [];

      existing.push(body);
      await env.BUGS.put("all", JSON.stringify(existing));

      return json({ success: true });
    }

    // -----------------------------
    // GET BUG REPORTS
    // -----------------------------
    if (url.pathname === "/api/bugs") {
      const reports = await env.BUGS.get("all", { type: "json" }) || [];
      return json(reports);
    }

    // -----------------------------
    // UPDATE STATUS
    // -----------------------------
    if (url.pathname === "/api/status" && request.method === "POST") {
      const body = await request.json();
      await env.STATUS.put("current", JSON.stringify(body));
      return json({ success: true });
    }

    // -----------------------------
    // GET STATUS
    // -----------------------------
    if (url.pathname === "/api/status") {
      const status = await env.STATUS.get("current", { type: "json" }) || {
        status: "working",
        timestamp: new Date().toISOString(),
      };
      return json(status);
    }

    // -----------------------------
    // DEFAULT
    // -----------------------------
    return new Response("Circle K API — Online", {
      headers: cors,
    });
  },
};
