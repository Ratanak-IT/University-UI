import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.careerpatch.site";

async function handleProxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname.replace(/^\/api\/proxy/, "/api/v1");
  const search = req.nextUrl.search;
  const targetUrl = `${BACKEND_BASE}${pathname}${search}`;

  const headers = new Headers();
  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    headers.set("authorization", authHeader);
  }
  headers.set("accept", "application/json");

  try {
    const body =
      req.method !== "GET" && req.method !== "HEAD"
        ? await req.text()
        : undefined;

    if (body) {
      headers.set("content-type", req.headers.get("content-type") || "application/json");
    }

    const backendRes = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });

    const data = await backendRes.arrayBuffer();
    return new NextResponse(data, {
      status: backendRes.status,
      statusText: backendRes.statusText,
      headers: {
        "content-type": backendRes.headers.get("content-type") || "application/json",
      },
    });
  } catch (err: any) {
    console.error(`Route Handler Proxy Error [${targetUrl}]:`, err);
    return NextResponse.json(
      { message: "Backend service connection error", error: err?.message },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest) {
  return handleProxy(req);
}

export async function POST(req: NextRequest) {
  return handleProxy(req);
}

export async function PUT(req: NextRequest) {
  return handleProxy(req);
}

export async function PATCH(req: NextRequest) {
  return handleProxy(req);
}

export async function DELETE(req: NextRequest) {
  return handleProxy(req);
}
