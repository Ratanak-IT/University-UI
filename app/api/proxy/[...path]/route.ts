import { NextRequest, NextResponse } from "next/server";

function getBackendOrigin(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (process.env as Record<string, string | undefined>).NEXT_PUBLICE_BASE_API ||
    "";

  return raw
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/api\/v1$/i, "");
}

async function handleProxy(req: NextRequest) {
  const backendBase = getBackendOrigin();
  const pathname = req.nextUrl.pathname.replace(/^\/api\/proxy(\/api\/v1)?/, "/api/v1");
  const search = req.nextUrl.search;
  const targetUrl = `${backendBase}${pathname}${search}`;

  const headers = new Headers();
  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    headers.set("authorization", authHeader);
  }

  const contentTypeHeader = req.headers.get("content-type");
  if (contentTypeHeader) {
    headers.set("content-type", contentTypeHeader);
  }

  const acceptHeader = req.headers.get("accept");
  headers.set("accept", acceptHeader || "application/json");

  try {
    const body =
      req.method !== "GET" && req.method !== "HEAD"
        ? await req.arrayBuffer()
        : undefined;

    const backendRes = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });

    if (backendRes.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

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
