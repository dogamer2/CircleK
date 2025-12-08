export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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

      return Response.json({
        totalSaved: total,
        redeemedItems: redeemed
      });
    }

    // -----------------------------
    // SAVE A BUG REPORT
    // -----------------------------
    if (url.pathname === "/api/bugs" && request.method === "POST") {
      const report = await request.json();
      const allReports = await env.BUGS.get("all", { type: "json" }) || [];

      allReports.push(report);
      await env.BUGS.put("all", JSON.stringify(allReports));

      return Response.json({ success: true, report });
    }

    // -----------------------------
    // GET ALL BUG REPORTS
    // -----------------------------
    if (url.pathname === "/api/bugs") {
      const allReports = await env.BUGS.get("all", { type: "json" }) || [];
      return Response.json(allReports);
    }

    // -----------------------------
    // UPDATE STATUS
    // -----------------------------
    if (url.pathname === "/api/status" && request.method === "POST") {
      const body = await request.json();
      await env.STATUS.put("current", JSON.stringify(body));

      return Response.json({ success: true, status: body });
    }

    // -----------------------------
    // GET STATUS
    // -----------------------------
    if (url.pathname === "/api/status") {
      const status = await env.STATUS.get("current", { type: "json" }) || {
        status: "working",
        timestamp: new Date().toISOString()
      };
      return Response.json(status);
    }

    // DEFAULT RESPONSE
    return new Response("CircleK API — Online", { status: 200 });
  }
};
