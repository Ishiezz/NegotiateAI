import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    const lastUserMessage = messages[messages.length - 1].content.toLowerCase();

    let reply = "I've noted that. To give you an accurate quote, I'll need to know the specific quantity and your preferred delivery timeline.";
    const extractedTerms: Record<string, string> = {}

    // Material Extraction
    const materials = [
      { keywords: ['copper', 'cu'], name: 'Copper Cathodes' },
      { keywords: ['steel', 'iron', 'beam'], name: 'Structural Steel' },
      { keywords: ['aluminum', 'al'], name: 'Aluminum Ingots' },
      { keywords: ['lithium', 'li'], name: 'Lithium Carbonate' },
      { keywords: ['nickel', 'ni'], name: 'Nickel Pellets' }
    ];

    for (const mat of materials) {
      if (mat.keywords.some(k => lastUserMessage.includes(k))) {
        extractedTerms.material = mat.name;
        break;
      }
    }

    // Quantity Extraction (e.g. "5 tons", "200kg", "10 units")
    const qtyMatch = lastUserMessage.match(/(\d+(?:\.\d+)?)\s*(ton|tonne|kg|unit|lb|mt|pound)s?/);
    if (qtyMatch) {
      extractedTerms.quantity = `${qtyMatch[1]} ${qtyMatch[2]}${parseFloat(qtyMatch[1]) > 1 ? 's' : ''}`;
    }

    // Price Negotiation Logic
    if (extractedTerms.material) {
      const basePrices: Record<string, string> = {
        'Copper Cathodes': '$8,450',
        'Structural Steel': '$1,200',
        'Aluminum Ingots': '$2,300',
        'Lithium Carbonate': '$14,000',
        'Nickel Pellets': '$16,500'
      };
      const price = basePrices[extractedTerms.material] || '$5,000';
      reply = `Understood. For ${extractedTerms.material}, our current market rate is ${price} per metric tonne. Does this volume work for your procurement cycle?`;
      extractedTerms.targetPrice = price;
    } else if (lastUserMessage.includes('price') || lastUserMessage.includes('expensive') || lastUserMessage.includes('discount') || lastUserMessage.includes('budget')) {
      reply = "I understand. For bulk orders or long-term contracts, we can offer a 5-8% discount on the spot price. Would you like to see a tiered pricing proposal?";
      extractedTerms.targetPrice = "Negotiating (Pending Volume)";
    } else if (lastUserMessage.includes('urgent') || lastUserMessage.includes('fast') || lastUserMessage.includes('soon') || lastUserMessage.includes('friday')) {
      reply = "We can prioritize your shipment for an express handling fee, or schedule it for standard delivery by next Tuesday at no extra cost. Which do you prefer?";
      extractedTerms.delivery = lastUserMessage.includes('friday') ? 'This Friday (Express)' : 'Next Tuesday';
    } else if (lastUserMessage.includes('deal') || lastUserMessage.includes('accept') || lastUserMessage.includes('confirm') || lastUserMessage.includes('yes')) {
      reply = "Excellent choice. I've updated the terms. You can now 'Accept & Sign' the agreement in the right panel to finalize the purchase order.";
    }

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    return NextResponse.json({ 
      reply,
      extractedTerms: Object.keys(extractedTerms).length > 0 ? extractedTerms : null
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
