import { NextRequest, NextResponse } from "next/server";
import { extractGoogleDriveFileId } from "@/lib/drive";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  const fileId = extractGoogleDriveFileId(url);
  const targetUrl = fileId
    ? `https://drive.usercontent.google.com/download?id=${fileId}&export=download`
    : url;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      redirect: "follow",
    });

    if (response.ok && response.body) {
      return new NextResponse(response.body, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'inline; filename="document.pdf"',
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      });
    }

    // Fallback if needed
    const fallbackUrl = fileId
      ? `https://drive.google.com/uc?export=download&id=${fileId}`
      : url;

    const fbResponse = await fetch(fallbackUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      redirect: "follow",
    });

    if (fbResponse.ok && fbResponse.body) {
      return new NextResponse(fbResponse.body, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'inline; filename="document.pdf"',
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      });
    }

    return new NextResponse("Failed to fetch file from Google Drive", {
      status: 502,
    });
  } catch (error: unknown) {
    console.error("PDF Proxy error:", error);
    return new NextResponse("Failed to proxy PDF", { status: 500 });
  }
}
