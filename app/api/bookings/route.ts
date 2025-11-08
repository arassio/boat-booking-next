import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const bookings = await prisma.booking.findMany();
  return Response.json(bookings);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const booking = await prisma.booking.create({ data });
    return Response.json(booking);
  } catch (error) {
    console.error("API error:", error);
    return new Response("Error creating booking", { status: 500 });
  }
}
