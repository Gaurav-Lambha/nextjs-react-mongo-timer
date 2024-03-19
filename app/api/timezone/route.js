import { NextResponse } from "next/server";

export async function GET() {  
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  const timers = await fetch(process.env.TIMEZONE_API_URL, requestOptions).then((response) => response.text()).then((response) => JSON.parse(response));   
  return NextResponse.json( {timeZone: timers} , { status: 200 });
}

export async function POST(request) {
  const { timeZone } = await request.json();
  const requestOptions = {
   method: "GET",
   redirect: "follow"
 };
 const URL =`${process.env.TIMEZONE_DETAILS_API_URL}?timeZone=${timeZone}`;
 const timerZone = await fetch(URL, requestOptions).then((response) => response.text()).then((response) => JSON.parse(response));   
 return NextResponse.json( {timeZone: timerZone} , { status: 200 });
}
