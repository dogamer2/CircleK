// functions/api/[[path]].ts
export const onRequest: PagesFunction = async ({ request }) => {
  // Only allow POST requests (your frontend only uses POST)
  if (request.method !== "POST" && request.method !== "OPTIONS") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Instant fake success – this is all your site needs to stop crying
  return new Response(
    JSON.stringify({
      success: true,
      message: "redeemed lol",
      redeemed: "chips",
      count: Math.floor(Math.random() * 900) + 100
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    }
  );
};
