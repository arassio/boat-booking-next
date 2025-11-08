"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BookingPage() {
  const [customer, setCustomer] = useState("");
  const [trip, setTrip] = useState("");
  const [seats, setSeats] = useState<number | "">("");
  const [date, setDate] = useState<Date | null>(null);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Submitting...");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          trip: `${trip} (${date ? date.toLocaleDateString("en-GB") : ""})`,
          seats: seats || 1,
        }),
      });

      if (!res.ok) throw new Error("Failed to book");

      setMessage("Your reservation has been completed!");
      setCustomer("");
      setTrip("");
      setSeats("");
      setDate(null);
    } catch (error: unknown) {
      console.error(error);
      setMessage("Something went wrong, please try again.");
    }
  }

  function increaseSeats() {
    setSeats((prev) => (prev === "" ? 1 : Number(prev) + 1));
  }

  function decreaseSeats() {
    setSeats((prev) => {
      const newVal = typeof prev === "number" ? Math.max(prev - 1, 1) : 1;
      return newVal;
    });
  }

  return (
    <main className="flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-4">Book Your Ticket</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-80 border p-4 rounded shadow-sm"
      >
        <input
          type="text"
          placeholder="Your Name"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Trip (e.g. White Tower → Perea)"
          value={trip}
          onChange={(e) => setTrip(e.target.value)}
          className="border p-2 rounded"
          required
        />

        {/* Date Picker */}
        <DatePicker
          selected={date}
          onChange={(selected) => setDate(selected)}
          dateFormat="dd/MM/yyyy"
          placeholderText="DD/MM/YYYY"
          className="border p-2 rounded"
          showPopperArrow={false}
          isClearable
        />

        {/* Ticket count with +/- controls */}
        <div className="flex items-center justify-between border rounded p-2">
          <button
            type="button"
            onClick={decreaseSeats}
            className="bg-gray-200 px-3 py-1 rounded text-lg hover:bg-gray-300"
          >
            –
          </button>

          <input
            type="number"
            min="1"
            placeholder="Enter amount"
            value={seats}
            onChange={(e) => {
              const val = e.target.value;
              setSeats(val === "" ? "" : Math.max(Number(val), 1));
            }}
            className="w-20 text-center outline-none"
          />

          <button
            type="button"
            onClick={increaseSeats}
            className="bg-gray-200 px-3 py-1 rounded text-lg hover:bg-gray-300"
          >
            +
          </button>
        </div>

        {/* Dynamic label */}
        <p className="text-sm text-center text-gray-600">
          {seats === "" ? "No tickets selected" : `${seats} ${seats === 1 ? "Ticket" : "Tickets"}`}
        </p>

        <button
          type="submit"
          disabled={seats === ""}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          Reserve
        </button>
      </form>

      {message && <p className="mt-4 font-medium">{message}</p>}
    </main>
  );
}
