import Property from '../models/Property.js';
import SiteSettings from '../models/SiteSettings.js';

const MAX_MESSAGES   = 20;   // max history turns to accept
const MAX_MSG_LENGTH = 1000; // max chars per message

/**
 * POST /api/chat
 * public chat completion proxy to NVIDIA Llama 3.1 8B Instruct model
 */
export const handleChat = async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: 'Invalid messages array' });
    }

    // FIX: Limit message count and per-message length to prevent prompt injection / API abuse
    if (messages.length > MAX_MESSAGES) {
      return res.status(400).json({ success: false, message: `Too many messages. Maximum ${MAX_MESSAGES} allowed.` });
    }

    const ALLOWED_ROLES = new Set(['user', 'assistant']);
    for (const msg of messages) {
      if (!ALLOWED_ROLES.has(msg.role)) {
        return res.status(400).json({ success: false, message: 'Invalid message role. Only "user" and "assistant" are allowed.' });
      }
      if (typeof msg.content !== 'string' || msg.content.trim() === '') {
        return res.status(400).json({ success: false, message: 'Each message must have non-empty string content.' });
      }
      if (msg.content.length > MAX_MSG_LENGTH) {
        return res.status(400).json({ success: false, message: `Message too long. Maximum ${MAX_MSG_LENGTH} characters per message.` });
      }
    }

    // 1. Fetch dynamic property inventory & site settings from DB
    const [properties, siteSettings] = await Promise.all([
      Property.find({ isActive: true }).select('title type priceLabel location city bedrooms bathrooms area'),
      SiteSettings.findOne()
    ]);

    const brandName = siteSettings?.logoTextPrimary 
      ? `${siteSettings.logoTextPrimary} ${siteSettings.logoTextSecondary || ''}`.trim() 
      : 'RealEstate';

    const catalogStr = properties.map((p) => (
      `- ${p.title} (${p.type}) in ${p.location}, ${p.city} | Price: ${p.priceLabel} | Layout: ${p.bedrooms} BHK, ${p.bathrooms} Baths, Area: ${p.area} sqft`
    )).join('\n');

    // 2. Formulate system guidelines prompt
    const systemPrompt = {
      role: 'system',
      content: `You are the ${brandName} AI Luxury Real Estate Advisor. Your tone must be highly professional, polite, elegant, and informative.\nYou represent ${brandName}, premier real estate consultancy, specializing in helping NRI (Non-Resident Indian) clients find elite properties and handle secure investments entirely remotely.\n\nHere is the current active inventory of verified premium properties on our platform:\n${catalogStr || 'No properties listed currently.'}\n\nRules of conduct:\n1. Always guide buyers towards these listings when they ask for recommendations.\n2. Provide guidance on NRI investment compliance: under FEMA/RBI rules, NRIs and OCIs can purchase residential or commercial properties freely in India. They DO NOT need RBI approval. However, they CANNOT buy agricultural land, plantation properties, or farmhouses unless they get special permission or inherit it.\n3. Keep answers concise, and focus strictly on real estate, prime localities, NRI processes, and ${brandName} services.\n4. If a client asks for off-topic questions, politely guide them back to real estate or property inquiries.`
    };

    // Inject system instructions as the very first message
    const apiMessages = [systemPrompt, ...messages];

    // 3. Request completion from NVIDIA LLama endpoint
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'NVIDIA API Key not configured on server' });
    }

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-8b-instruct',
        messages: apiMessages,
        temperature: 0.2,
        top_p: 0.7,
        max_tokens: 1024
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('NVIDIA completion error:', data);
      return res.status(response.status).json({
        success: false,
        message: data.error?.message || 'Chatbot request failed'
      });
    }

    const reply = data.choices?.[0]?.message?.content || '';
    return res.status(200).json({
      success: true,
      reply
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
