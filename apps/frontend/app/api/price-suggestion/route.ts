import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Enhanced prompt for Gemini 2.5 Pro with detailed analysis
    const prompt = `
You are a professional real estate appraiser specializing in Pakistani rental markets. Analyze the following property details and provide a comprehensive rental price assessment.

PROPERTY DETAILS:
- Type: ${data.propertyType}
- Area: ${data.area} ${data.areaUnit}
- Location: ${data.address}, ${data.city}
- Bedrooms: ${data.bedrooms}
- Floors: ${data.floors}
- Kitchens: ${data.kitchens}
- Has Lawn: ${data.hasLawn ? 'Yes' : 'No'}
- Furnishing: ${data.furnishingStatus}
- Additional Info: ${data.additionalInfo || 'None provided'}

ANALYSIS REQUIREMENTS:
1. Consider current Pakistani real estate market trends (2024-2025)
2. Factor in city-specific pricing (major cities like Lahore, Karachi, Islamabad command higher prices)
3. Analyze area unit conversion (1 Kanal = 20 Marla)
4. Consider property type premiums (Villa > House > Apartment > Portion)
5. Account for furnishing status (Furnished properties typically rent 20-30% higher)
6. Factor in additional features (lawn, multiple floors, extra kitchens)
7. Consider location within city (premium areas like DHA, Bahria Town, etc.)

PRICING FACTORS FOR PAKISTAN:
- Lahore: Premium areas (DHA, Gulberg, Cantonment) - High rates
- Karachi: Clifton, Defence, Gulshan - Premium pricing
- Islamabad: F-sectors, E-sectors, I-sectors - Government employee area pricing
- Other cities: Adjust based on local economic conditions

RESPONSE FORMAT:
Provide your analysis in this JSON format:
{
  "suggestedPrice": [monthly rent in PKR as integer],
  "priceRange": {
    "min": [minimum suggested price],
    "max": [maximum suggested price]
  },
  "analysis": {
    "basePrice": [base price before adjustments],
    "adjustments": [
      {
        "factor": "location premium/discount",
        "impact": "+/- percentage or amount",
        "reasoning": "brief explanation"
      },
      {
        "factor": "property size",
        "impact": "+/- percentage or amount", 
        "reasoning": "brief explanation"
      },
      {
        "factor": "furnishing status",
        "impact": "+/- percentage or amount",
        "reasoning": "brief explanation"
      }
    ],
    "marketInsights": "Current market conditions and trends affecting this property type and location"
  },
  "recommendations": [
    "Specific recommendations for optimal pricing strategy"
  ]
}

Important: Return valid JSON only, no additional text or formatting.
`;

    // Call Gemini 2.5 Pro API
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3, // Lower temperature for more consistent pricing
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      throw new Error(`Gemini API error: ${geminiRes.status}`);
    }

    const geminiData = await geminiRes.json();
    let responseText = "";
    
    try {
      responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (error) {
      throw new Error("Failed to parse Gemini response");
    }

    // Parse the JSON response from Gemini
    let analysisResult;
    try {
      // Clean the response text to ensure it's valid JSON
      const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();
      analysisResult = JSON.parse(cleanedText);
    } catch (error) {
      // Fallback: extract just the price if JSON parsing fails
      const priceMatch = responseText.match(/\d+/);
      const fallbackPrice = priceMatch ? parseInt(priceMatch[0], 10) : null;
      
      return NextResponse.json({
        price: fallbackPrice,
        analysis: null,
        error: "Detailed analysis unavailable, showing basic price estimate"
      });
    }

    // Validate the analysis result
    if (!analysisResult.suggestedPrice || isNaN(analysisResult.suggestedPrice)) {
      throw new Error("Invalid price suggestion received");
    }

    return NextResponse.json({
      price: analysisResult.suggestedPrice,
      priceRange: analysisResult.priceRange,
      analysis: analysisResult.analysis,
      recommendations: analysisResult.recommendations,
      success: true
    });

  } catch (error) {
    console.error("Price suggestion error:", error);
    
    return NextResponse.json({
      price: null,
      error: "Failed to generate price suggestion. Please try again.",
      success: false
    }, { status: 500 });
  }
}