// server.ts
import express, { Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; // ⚡ নতুন ইম্পোর্ট
import { EventItem, Booking } from "./src/types";
import { INITIAL_EVENTS } from "./src/data/initialEvents";

const app = express();
const PORT = process.env.PORT || 5000;

// ⚡ ES Module scope-এ __dirname তৈরি করার মেকানিজম
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// Local Data Persistence Setup (Mock DB file paths)
const DATA_DIR = path.join(__dirname, "db");
const EVENTS_FILE = path.join(DATA_DIR, "events.json");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

// Ensure DB directory and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}
if (!fs.existsSync(EVENTS_FILE)) {
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(INITIAL_EVENTS, null, 2));
}
if (!fs.existsSync(BOOKINGS_FILE)) {
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify([], null, 2));
}

// Helper functions to read/write DB
const readEvents = (): EventItem[] =>
  JSON.parse(fs.readFileSync(EVENTS_FILE, "utf-8"));
const writeEvents = (data: EventItem[]) =>
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(data, null, 2));
const readBookings = (): Booking[] =>
  JSON.parse(fs.readFileSync(BOOKINGS_FILE, "utf-8"));
const writeBookings = (data: Booking[]) =>
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(data, null, 2));

// ==========================================
// 🎟️ EVENT APIs (Requirement 8 & 9)
// ==========================================

// 1. Get all events
app.get("/api/events", (req: Request, res: Response) => {
  try {
    const events = readEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve assemblies." });
  }
});

// 2. Create a new event (Requirement 8)
app.post("/api/events", (req: Request, res: Response) => {
  try {
    const newEventData = req.body;
    if (!newEventData.title || !newEventData.category) {
      res.status(400).json({ error: "Title and category are required." });
      return;
    }

    const events = readEvents();
    const newEvent: EventItem = {
      ...newEventData,
      id: `event-${Date.now()}`,
      reviews: [],
    };

    events.unshift(newEvent); // Add to the top of the list
    writeEvents(events);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: "Failed to record the assembly." });
  }
});

// 3. Delete an event (Requirement 9)
app.delete("/api/events/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let events = readEvents();
    const eventExists = events.some((e) => e.id === id);

    if (!eventExists) {
      res.status(404).json({ error: "Assembly not found." });
      return;
    }

    events = events.filter((e) => e.id !== id);
    writeEvents(events);

    // clean up related bookings too
    let bookings = readBookings();
    bookings = bookings.filter((b) => b.eventId !== id);
    writeBookings(bookings);

    res.json({ message: "Assembly successfully purged.", id });
  } catch (error) {
    res.status(500).json({ error: "Failed to purge assembly." });
  }
});

// 4. Add a Review to an Event (Requirement 7)
app.post("/api/events/:id/reviews", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userName, rating, comment } = req.body;

    let events = readEvents();
    const eventIndex = events.findIndex((e) => e.id === id);

    if (eventIndex === -1) {
      res.status(404).json({ error: "Assembly not found." });
      return;
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      userName,
      rating,
      comment,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      userInitials: userName
        .split(" ")
        .map((n: string) => n[0])
        .join(""),
    };

    events[eventIndex].reviews = [
      newReview,
      ...(events[eventIndex].reviews || []),
    ];
    writeEvents(events);
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: "Failed to log review." });
  }
});

// ==========================================
// 🎟️ BOOKING APIs (Requirement 11)
// ==========================================

// 1. Get all bookings
app.get("/api/bookings", (req: Request, res: Response) => {
  try {
    const bookings = readBookings();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tickets portfolio." });
  }
});

// 2. Book tickets
app.post("/api/bookings", (req: Request, res: Response) => {
  try {
    const { eventId, eventTitle, eventImage, quantity, price } = req.body;

    let events = readEvents();
    const eventIndex = events.findIndex((e) => e.id === eventId);

    if (eventIndex === -1) {
      res.status(404).json({ error: "Assembly not found." });
      return;
    }

    const event = events[eventIndex];
    if (event.spotsLeft !== undefined && event.spotsLeft < quantity) {
      res.status(400).json({ error: "No available passes left." });
      return;
    }

    // Deduct available seats on Event database
    if (event.spotsLeft !== undefined) {
      event.spotsLeft = Math.max(0, event.spotsLeft - quantity);
    }
    writeEvents(events);

    // Save booking
    const bookings = readBookings();
    const newBooking: Booking = {
      id: `TX-${Math.floor(Math.random() * 900000) + 100000}`,
      eventId,
      eventTitle,
      eventImage,
      bookingDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      price,
    };

    bookings.unshift(newBooking);
    writeBookings(bookings);

    res.status(201).json({ booking: newBooking, updatedEvent: event });
  } catch (error) {
    res.status(500).json({ error: "Failed to register reservation." });
  }
});

// 3. Cancel booking (Requirement 10)
app.delete("/api/bookings/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let bookings = readBookings();
    const booking = bookings.find((b) => b.id === id);

    if (!booking) {
      res.status(404).json({ error: "Booking transaction not found." });
      return;
    }

    // Restore seat count on original event
    let events = readEvents();
    const eventIndex = events.findIndex((e) => e.id === booking.eventId);
    if (eventIndex !== -1 && events[eventIndex].spotsLeft !== undefined) {
      events[eventIndex].spotsLeft = (events[eventIndex].spotsLeft || 0) + 1;
      writeEvents(events);
    }

    // Remove booking
    bookings = bookings.filter((b) => b.id !== id);
    writeBookings(bookings);

    res.json({ message: "Booking canceled successfully.", id });
  } catch (error) {
    res.status(500).json({ error: "Failed to terminate booking pass." });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(
    `🚀 Assembly Backend Server actively running on: http://localhost:${PORT}`
  );
});
