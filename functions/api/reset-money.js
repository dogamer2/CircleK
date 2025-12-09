export async function onRequestPost(context) {
  const { env } = context;
  
  try {
    // Clear all redeemed items
    await env.CIRCLEK_DB.put('redeemed_items', '[]');
    
    // Reset all redemption counts
    const products = ['chips', 'candy', 'alani', 'arizona', 'froster'];
    for (const product of products) {
      await env.CIRCLEK_DB.put(`count_${product}`, '0');
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'All money data reset successfully',
      totalSaved: 0,
      redemptionCounts: {}
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
