export async function onRequest(context) {
  const { DB } = context.env;

  const row = await DB.prepare(
    "SELECT working FROM status ORDER BY id DESC LIMIT 1"
  ).first();

  return new Response(JSON.stringify(row || { working: 1 }), {
    headers: { "Content-Type": "application/json" }
  });
}
