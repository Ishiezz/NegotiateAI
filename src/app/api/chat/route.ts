import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    const lastUserMessage = messages[messages.length - 1].content.toLowerCase();

    let reply = "I understand. Could you provide more specifics on the quantity and delivery timeline?";
    let extractedTerms = {};

    if (lastUserMessage.includes('copper') || lastUserMessage.includes('steel')) {
      const isCopper = lastUserMessage.includes('copper');
      extractedTerms = {
        material: isCopper ? 'Copper Wire' : 'Steel Beams',
        quantity: '2 Tonnes',
        delivery: 'This Friday'
      };
      reply = `We can definitely supply the ${isCopper ? 'copper wire' : 'steel beams'} by this Friday. Our standard rate for 2 tonnes is $8,500. Does that align with your budget?`;
    } else if (lastUserMessage.includes('expensive') || lastUserMessage.includes('price') || lastUserMessage.includes('$')) {
      reply = "I understand budget is a concern. If you can commit to a monthly order, I could bring the price down to $8,100 per 2 tonnes. How does that sound?";
      extractedTerms = { targetPrice: '$8,100 (Negotiated)' };
    } else if (lastUserMessage.includes('deal') || lastUserMessage.includes('accept') || lastUserMessage.includes('yes')) {
      reply = "Excellent. I will draw up the contract for $8,100 for 2 tonnes delivered by Friday. Thank you for doing business with SteelCorp.";
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({ 
      reply,
      extractedTerms: Object.keys(extractedTerms).length > 0 ? extractedTerms : null
    });
  } catch {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
