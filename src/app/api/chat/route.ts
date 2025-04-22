import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    console.log('🔵 Chat API: Received request');
    const body = await req.json();
    console.log('📥 Chat API: Request payload', body);

    const { sessionId, action, chatInput } = body;

    // Forward to n8n
    const n8nResponse = await fetch('http://localhost:5678/webhook/test-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        action,
        chatInput,
      }),
    });

    console.log('📡 Chat API: n8n response status:', n8nResponse.status);
    const data = await n8nResponse.json();
    console.log('📦 Chat API: Response data:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 