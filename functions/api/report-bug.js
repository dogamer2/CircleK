export async function onRequest(context) {
  const { DB } = context.env;
  const { report } = await context.request.json();

  await DB.prepare("INSERT INTO bug_reports (report) VALUES (?)")
    .bind(report)
    .run();

  return new Response("Bug reported", { status: 200 });
}
