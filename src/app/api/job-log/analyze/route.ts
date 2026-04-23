// import { NextResponse } from "next/server";

// export async function POST() {
//   return NextResponse.json({ message: "ok" });
// }


// src/app/api/job-analyze/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" } 
    });

    // 1. 해당 URL의 HTML 데이터 가져오기
    const res = await fetch(url);
    const html = await res.text();
    
    // 2. 텍스트 데이터만 간단히 추출 (태그 제거)
    const cleanText = html.replace(/<[^>]*>?/gm, ' ').slice(0, 3000);

    // 3. Gemini에게 데이터 정제 요청
    const prompt = `
      다음 채용 공고 텍스트에서 회사명, 포지션, 도메인 정보를 추출해서 JSON으로만 답해줘.
      텍스트: ${cleanText}
      형식: {"company_name": "...", "job_title": "...", "domain": "..."}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid JSON format from AI");
    
    const data = JSON.parse(jsonMatch[0]);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: "분석 실패" }, { status: 500 });
  }
}