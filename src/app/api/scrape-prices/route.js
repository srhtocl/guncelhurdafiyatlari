import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as cheerio from 'cheerio';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'GEMINI_API_KEY bulunamadı.' }, { status: 500 });
        }

        const { url, type } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'URL gereklidir.' }, { status: 400 });
        }

        // 1. Hedef URL'den HTML çek
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            },
            next: { revalidate: 0 }
        });
        
        if (!response.ok) {
            throw new Error(`Hedef siteye erişilemedi: ${response.status}`);
        }

        const html = await response.text();

        // 2. HTML'i Cheerio ile parse et (Sadece text ve tabloları alarak küçült)
        const $ = cheerio.load(html);
        
        // Sadece tabloları veya listeleri alsak daha verimli, ama genel text alalım
        // Gereksiz script, style, nav vb. kısımları temizle
        $('script, style, nav, header, footer, iframe, noscript').remove();
        
        // Kalan texti al
        let bodyText = $('body').text().replace(/\s+/g, ' ').trim();
        
        // Çok büyükse kırp (Gemini limitini aşmamak için)
        if (bodyText.length > 30000) {
            bodyText = bodyText.substring(0, 30000);
        }

        // 3. Gemini Prompt'u Hazırla
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `
        Aşağıda bir web sayfasından kazınmış düz metin var. Bu web sitesi hurda fiyatları yayınlamaktadır.
        Senin görevin bu metindeki ${type || 'hurda'} fiyatlarını bulup çıkarmaktır.
        Lütfen bana sadece JSON formatında, hiçbir açıklama metni olmadan, aşağıdaki yapıya birebir uygun olarak yanıt ver:

        [
            {
                "subtype": "Hurda Alt Türü (Örn: Soyma Bakır, DKP Demir)",
                "price": Fiyat (Sadece sayı, float cinsinden)
            }
        ]
        
        Dikkat: Eğer fiyat aralığı (örn: 100 - 110) varsa ortalamasını al, ya da bir tanesini seç (tercihen yüksek olanı). Para birimi sembollerini dahil etme. Bulamazsan boş dizi [] dön.

        Metin:
        ${bodyText}
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // 4. JSON yanıtını parse et
        // Bazen model markdown içinde dönebilir ( ```json ... ``` )
        let cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const parsedData = JSON.parse(cleanJson);

        return NextResponse.json({ success: true, data: parsedData });

    } catch (error) {
        console.error("Scrape Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
