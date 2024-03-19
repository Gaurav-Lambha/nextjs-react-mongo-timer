import connectMongoDB from "@/app/libs/mongoDB";
import Timers from "@/app/models/timer";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;
  await connectMongoDB();
  const timer = await Timers.findOne({ _id: id });
  return NextResponse.json({ timer }, { status: 200 });
}

export async function POST(request, { params }) {
  const { id } = params;
  const { endDateTime, isExpire } = await request.json();
  await connectMongoDB();
  await Timers.findByIdAndUpdate(id, { endDateTime, isExpire });
  return NextResponse.json(
    { message: "Timer updated successfully" },
    { status: 200 }
  );
}

export async function DELETE(request, { params }) {
  const { id } = params;
  console.log("DELETE", id);
  await connectMongoDB();
  await Timers.findByIdAndDelete(id);
  return NextResponse.json(
    { message: "Timer deleted successfully" },
    { status: 200 }
  );
}
