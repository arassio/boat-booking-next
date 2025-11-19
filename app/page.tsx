"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BookingPage() {
  const [customer, setCustomer] = useState("");
  const [tripType, setTripType] = useState<"oneway" | "roundtrip">("oneway");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [seats, setSeats] = useState<number>(1);
  const [date, setDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [message, setMessage] = useState("");
  const [showTravelers, setShowTravelers] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Submitting...");

    const tripDescription = tripType === "roundtrip" && returnDate
      ? `${from} → ${to} (${date?.toLocaleDateString("en-GB")} - ${returnDate.toLocaleDateString("en-GB")})`
      : `${from} → ${to} (${date?.toLocaleDateString("en-GB")})`;

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          trip: tripDescription,
          seats,
        }),
      });

      if (!res.ok) throw new Error("Failed to book");

      setMessage("Your reservation has been completed!");
      setCustomer("");
      setFrom("");
      setTo("");
      setSeats(1);
      setDate(null);
      setReturnDate(null);
    } catch (error: unknown) {
      console.error(error);
      setMessage("Something went wrong, please try again.");
    }
  }

  function increaseSeats() {
    setSeats((prev) => prev + 1);
  }

  function decreaseSeats() {
    setSeats((prev) => Math.max(prev - 1, 1));
  }

  return (
    <main className="min-h-screen relative">
      {/* Hero Background with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="p-6">
          <h1 className="text-white text-3xl font-bold">Perea Ferry</h1>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center px-4 py-12 md:py-20">
          <div className="max-w-4xl w-full">
            <h2 className="text-white text-4xl md:text-5xl font-bold text-center mb-3 leading-tight">
              Book Your Ferry Tickets
            </h2>
            <p className="text-white/90 text-lg md:text-xl text-center mb-8">
              Travel between Thessaloniki and Perea with ease
            </p>

            {/* Booking Card */}
            <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8">
              {/* Trip Type Tabs */}
              <div className="flex gap-2 mb-6 border-b">
                <button
                  type="button"
                  onClick={() => setTripType("oneway")}
                  className={`pb-3 px-4 font-semibold transition-colors relative ${
                    tripType === "oneway"
                      ? "text-teal-600 border-b-2 border-teal-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  One Way
                </button>
                <button
                  type="button"
                  onClick={() => setTripType("roundtrip")}
                  className={`pb-3 px-4 font-semibold transition-colors relative ${
                    tripType === "roundtrip"
                      ? "text-teal-600 border-b-2 border-teal-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Round Trip
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Route Selection */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. White Tower"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Perea"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Date Selection */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departure Date
                    </label>
                    <DatePicker
                      selected={date}
                      onChange={(selected) => setDate(selected)}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select date"
                      className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                      minDate={new Date()}
                      required
                    />
                  </div>
                  {tripType === "roundtrip" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Return Date
                      </label>
                      <DatePicker
                        selected={returnDate}
                        onChange={(selected) => setReturnDate(selected)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select date"
                        className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                        minDate={date || new Date()}
                        required={tripType === "roundtrip"}
                      />
                    </div>
                  )}
                </div>

                {/* Travelers */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Travelers
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowTravelers(!showTravelers)}
                    className="w-full border border-gray-300 rounded-md p-3 text-left flex justify-between items-center hover:border-teal-500 transition-colors"
                  >
                    <span>{seats} {seats === 1 ? "Passenger" : "Passengers"}</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showTravelers && (
                    <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-20">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Passengers</span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={decreaseSeats}
                            className="w-8 h-8 rounded-full border-2 border-teal-600 text-teal-600 hover:bg-teal-50 flex items-center justify-center font-bold"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-semibold">{seats}</span>
                          <button
                            type="button"
                            onClick={increaseSeats}
                            className="w-8 h-8 rounded-full border-2 border-teal-600 text-teal-600 hover:bg-teal-50 flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Customer Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-md transition-colors shadow-md"
                >
                  Search & Book
                </button>
              </form>

              {message && (
                <div className={`mt-4 p-4 rounded-md ${
                  message.includes("completed")
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : message.includes("wrong")
                    ? "bg-red-50 text-red-800 border border-red-200"
                    : "bg-blue-50 text-blue-800 border border-blue-200"
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-12 bg-white/95">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-10 text-gray-800">
              Why Choose Perea Ferry?
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-lg mb-2">Fast & Reliable</h4>
                <p className="text-gray-600">Quick trips with punctual departures</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-lg mb-2">Best Prices</h4>
                <p className="text-gray-600">Affordable rates for all passengers</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="font-bold text-lg mb-2">Safe Travel</h4>
                <p className="text-gray-600">Modern vessels with safety standards</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
