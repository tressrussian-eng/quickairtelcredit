import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const number = process.env.NUMBER;
    const mobitech = process.env.MOBITECH;

    if (!number) {
      return NextResponse.json(
        { error: "NUMBER is undefined" },
        { status: 500 }
      );
    }

    if (!mobitech) {
      return NextResponse.json(
        { error: "MOBITECH is undefined" },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://app.mobitechtechnologies.com/sms/sendsms",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          h_api_key: mobitech,
        },
        body: JSON.stringify({
          ...body,
          mobile: number,
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("SMS error:", error);

    return NextResponse.json(
      { error: "Failed to send SMS" },
      { status: 500 }
    );
  }
}
