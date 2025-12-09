export async function onRequest(context) {
  const { DB } = context.env;

  const results = await DB.prepare(
    "SELECT * FROM bug_reports ORDER BY id DESC"
  ).all();

  return new Response(JSON.stringify(results.results), {
    headers: { "Content-Type": "application/json" }
  });
}
