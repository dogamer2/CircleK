export async function onRequest(context) {
  const { DB } = context.env;
  const { working } = await context.request.json();

  await DB.prepare("INSERT INTO status (working) VALUES (?)")
    .bind(working)
    .run();

  return new Response("Status updated", { status: 200 });
}
