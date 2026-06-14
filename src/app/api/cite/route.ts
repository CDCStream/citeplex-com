import { NextRequest, NextResponse } from "next/server";
import { generateCitation, generateAllStyles } from "@/lib/citation-engine";
import { type CitationStyle, type SourceData } from "@/lib/citation-styles";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sourceData, style, allStyles } = body as {
      sourceData: SourceData;
      style?: CitationStyle;
      allStyles?: boolean;
    };

    if (!sourceData || !sourceData.sourceType) {
      return NextResponse.json({ error: "Missing source data" }, { status: 400 });
    }

    if (allStyles) {
      const results = generateAllStyles(sourceData);
      return NextResponse.json({ results });
    }

    if (!style) {
      return NextResponse.json({ error: "Missing citation style" }, { status: 400 });
    }

    const result = generateCitation(sourceData, style);
    return NextResponse.json({ result });
  } catch {
    return NextResponse.json({ error: "Failed to generate citation" }, { status: 500 });
  }
}
