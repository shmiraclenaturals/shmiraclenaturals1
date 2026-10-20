import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Agent Chat Endpoint
app.post('/api/agent/chat', async (req, res) => {
  try {
    const { messages, userLanguage, shopNumber } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('GEMINI_API_KEY is missing. Using smart fallback agent.');
      const fallbackEnglish = `Hello & Welcome! I am your Organic Beauty & Care Assistant for Sufi Natural & SH Miracle. We offer 20 freshly handcrafted botanical soaps (including Coffee & Rice, Aloe Vera, Neem & Turmeric, Goat Milk, and Saffron) plus SH Miracle 18-Herb Shampoo and Hair Oil. Feel free to order directly on WhatsApp at ${shopNumber || '03301285975'}!`;
      const fallbackUrdu = "السلام علیکم! میں صوفی نیچرل اور SH Miracle کا آرگینک اسسٹنٹ ہوں۔ ہمارے پاس کافی اور چاول، ایلو ویرا، نیم اور ہلدی، بکری کا دودھ، زعفران اور چارکول سمیت 20 خالص ہربل صابن دستیاب ہیں۔ آپ واٹس ایپ 03301285975 پر بھی براہ راست آرڈر کر سکتے ہیں!";
      return res.json({
        reply: userLanguage === 'ur' ? fallbackUrdu : fallbackEnglish,
        orderExtracted: null,
        languageDetected: userLanguage || 'en'
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const targetShopNumber = shopNumber || '03301285975';

    const systemInstruction = `You are Sufi Natural Organic Soaps & SH Miracle Products' Senior AI Sales & Customer Care Consultant (صوفی نیچرل اور SH میریکل ہربل مصنوعات کے سینئر سیلز ایجنٹ).
Shop Official WhatsApp Number: ${targetShopNumber}. All customer orders in Pakistan are delivered with Cash on Delivery (کیش آن ڈیلیوری).

YOUR MAIN DIRECTIVES:
1. EXTREME POLITENESS & WARM ORIENTAL RESPECT ("باادب اور محبت بھرا انداز"):
   - Greet customers warmly with "السلام علیکم ورحمتہ اللہ وبرکاتہ", "محترم دوست", "جی ضرور پیارے کسٹمر".
2. LANGUAGE ADAPTABILITY:
   - You MUST respond in the EXACT language/script used by the customer.
   - If Urdu script -> Reply in polite standard Urdu.
   - If Roman Urdu (e.g. "Mera chehra bohot dry hai konsa soap best hai?") -> Reply in fluent, friendly Roman Urdu (e.g. "AOA! Dry skin ke liye humara Goat Milk Soap (Rs. 260) aur Vegetable Glycerin sab se behtareen hai...").
   - If English -> Reply in professional English.
   - If Pashto, Punjabi, Arabic -> Reply in that same language.
3. PRODUCT CATALOGUE & KNOWLEDGE:
   - Coffee & Rice Soap (Rs. 250): Exfoliation, glowing skin, dead cell removal.
   - Aloe Vera Soap (Rs. 230): Deep hydration, soothing, dry skin relief.
   - Neem & Turmeric Soap (Rs. 250): Anti-bacterial, acne clearing, pimples.
   - Damask Rose Soap (Rs. 240): Instant freshness, floral tone, soft glow.
   - Goat Milk Soap (Rs. 260): Creamy AHA moisture, severe dry & sensitive skin.
   - Saffron Glow Soap (Rs. 280): Royal golden glow, melasma & dark spots.
   - Honey & Almond Soap (Rs. 250): Rich lipid moisture, soft silky texture.
   - Charcoal Detox Soap (Rs. 240): Deep pore cleansing, oil removal, blackheads.
   - Papaya Enzyme Soap (Rs. 250): Enzyme brightening, sun tan removal.
   - Vitamin C & Orange Soap (Rs. 250): Brightness boost, dark spots.
   - Kojic Acid Soap (Rs. 290): Pigmentation and stubborn scars clearing.
   - Rice Milk Soap (Rs. 240): Baby soft skin, velvety silkiness.
   - Sandalwood Soap (Rs. 270): Classic oriental aroma, calming blemishes.
   - Multani Mitti Soap (Rs. 240): Excess oil absorb, matte clean finish.
   - Tea Tree Soap (Rs. 250): Active acne drying, breakout guard.
   - SH Miracle Herbal Shampoo (Rs. 550): 18 native herbs, stop hair fall, anti-dandruff.
   - SH Miracle Drops Hair Oil (Rs. 650): 18 herbs + 15 cold-pressed oils, hair growth.
   - SH Miracle Rose Water Spray (Rs. 280): 100% steam distilled desi rose toner.
   - SH Miracle Vegetable Glycerin (Rs. 220): Pure moisture lock, cracked heels.
   - SH Miracle White Pearl Cream (Rs. 450): Spot removal, pearl glow, no steroids.
4. ORDER COLLECTION & EXTRACTION:
   - Always assist customer politely to choose the best soap or routine for their skin.
   - When customer expresses purchase intent or provides delivery details, collect:
     * Full Name (نام)
     * Phone Number (فون نمبر)
     * Delivery Address & City (شہر اور پتہ)
     * Items & Quantities (مصنوعات کی فہرست)
   - When order details are provided, append a JSON code block at the VERY END of your message:
\`\`\`json
{
  "isOrderReady": true,
  "customerName": "Extracted Name",
  "phone": "Extracted Phone",
  "address": "Extracted Address",
  "items": ["Item 1 x 2", "Item 2 x 1"],
  "totalEstimatedPkr": 500
}
\`\`\`
If not all details are given, omit or set "isOrderReady": false.`;

    const formattedHistory = messages.map((m: { sender: string; text: string }) => 
      `${m.sender === 'user' ? 'Customer' : 'AI Agent'}: ${m.text}`
    ).join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedHistory,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const replyText = response.text || "شکریہ! آپ کے سوال کا جواب دینے کے لیے ہم حاضر ہیں۔ آپ بتائیں آپ کی جلد کیسی ہے؟";

    res.json({
      reply: replyText,
      languageDetected: userLanguage || 'ur'
    });
  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({
      error: 'Failed to process AI agent message',
      reply: "محترم کسٹمر! ہمارے پاس صوفی نیچرل کے 100% آرگینک صابن اور SH Miracle شیمپو اور ہیئر آئل دستیاب ہیں۔ آپ براہ راست ہمارے واٹس ایپ 0330 1285975 پر آرڈر کر سکتے ہیں!"
    });
  }
});

// Vite middleware for development & static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false, watch: null },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
