-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "customer" TEXT NOT NULL,
    "trip" TEXT NOT NULL,
    "seats" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);
