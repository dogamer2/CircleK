export async function onRequest(context) {
  const { DB } = context.env;
  const { amount } = await context.request.json();

  await DB.prepare("INSERT INTO money_redeemed (amount) VALUES (?)")
    .bind(amount)
    .run();

  return new Response("Money saved recorded", { status: 200 });
}
