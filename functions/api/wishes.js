// POST: 소원 저장
export async function onRequestPost(context) {
  try {
    const { text, stoneIdx } = await context.request.json();
    const id = Date.now().toString();
    
    // KV에 저장 (24시간 후 자동삭제)
    await context.env.WISHES_KV.put(id, JSON.stringify({ text, stoneIdx }), { 
      expirationTtl: 86400 
    });
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// GET: 소원 목록 가져오기
export async function onRequestGet(context) {
  try {
    const list = await context.env.WISHES_KV.list();
    const wishes = [];
    
    for (const key of list.keys) {
      const val = await context.env.WISHES_KV.get(key.name);
      if (val) wishes.push(JSON.parse(val));
    }
    
    return new Response(JSON.stringify(wishes.reverse()), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}