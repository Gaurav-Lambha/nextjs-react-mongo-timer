import connectMongoDB from "@/app/libs/mongoDB";
import Timers from "@/app/models/timer";
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongoDB();
  const timers = await Timers.find().sort({createdAt: -1});
  return NextResponse.json({ timers }, { status: 200 });
}

export async function POST(request) {
  const { timerName, startDateTime } = await request.json();
  await connectMongoDB();
  await Timers.create({ timerName, startDateTime });
  return NextResponse.json(
    { message: "Timer created successfully" },
    { status: 200 }
  );
}

