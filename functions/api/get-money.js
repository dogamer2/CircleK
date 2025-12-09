export async function onRequest(context) {
  const { DB } = context.env;

  const result = await DB.prepare(
    "SELECT SUM(amount) AS total FROM money_redeemed"
  ).first();

  return new Response(JSON.stringify(result || { total: 0 }), {
    headers: { "Content-Type": "application/json" }
  });
}
