import { NextResponse } from "next/server";

let trustCount = 1270;

export async function POST() {
  trustCount += 1;
  return NextResponse.json({ count: trustCount });
}
