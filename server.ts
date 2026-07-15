// server.ts
import express, { Request, Response } from "express";
import cors from "cors";
import { MongoClient, ObjectId } from 'mongodb';
import { INITIAL_EVENTS } from "./src/data/initialEvents";

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB URI Setup
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.warn("⚠️ Warning: MONGO_URI environment variable is missing!");
}

// Global caching variables for Serverless/Vercel optimization
let cachedClient: MongoClient | null = null;
let db: any = null;
let eventsCollection: any = null;
let bookingsCollection: any = null;

async function getDatabase() {
  if (db && eventsCollection && bookingsCollection) {
    return { eventsCollection, bookingsCollection };
  }

  if (!MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not defined.");
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(MONGO_URI);
    await cachedClient.connect();
    console.log("✅ New MongoDB Atlas connection established successfully!");
  }

  db = cachedClient.db("eventhub_db");
  eventsCollection = db.collection("events");
  bookingsCollection = db.collection("bookings");

  // Load initial events if the collection is empty
  const count = await eventsCollection.countDocuments();
  if (count === 0) {
    await eventsCollection.insertMany(INITIAL_EVENTS);
    console.log("📦 Initial static events successfully uploaded to MongoDB Atlas.");
  }

  return { eventsCollection, bookingsCollection };
}

// Middleware to ensure DB connection is ready before handling API requests
app.use(async (req, res, next) => {
  try {
    await getDatabase();
    next();
  } catch (error: any) {
    res.status(500).json({ error: "Database connection failed", details: error.message });
  }
});

// ==========================================
// 🎟️ EVENT APIs (Requirement 8 & 9)
// ==========================================

// 1. Get all events
app.get('/api/events', async (req: Request, res: Response) => {
  try {
    const events = await eventsCollection.find({}).toArray();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve assemblies.' });
  }
});

// 2. Create a new event
app.post('/api/events', async (req: Request, res: Response) => {
  try {
    const newEventData = req.body;
    if (!newEventData.title || !newEventData.category) {
       res.status(400).json({ error: 'Title and category are required.' });
       return;
    }

    const newEvent = {
      ...newEventData,
      reviews: []
    };

    const result = await eventsCollection.insertOne(newEvent);
    const savedEvent = { ...newEvent, id: result.insertedId.toString() };
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record the assembly.' });
  }
});

// 3. Delete an event
app.delete('/api/events/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = id.length === 24 ? { _id: new ObjectId(id) } : { id: id };
    const result = await eventsCollection.deleteOne(query);

    if (result.deletedCount === 0) {
       res.status(404).json({ error: 'Assembly not found.' });
       return;
    }

    // Clean up associated bookings
    await bookingsCollection.deleteMany({ eventId: id });

    res.json({ message: 'Assembly successfully purged.', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to purge assembly.' });
  }
});

// 4. Add review to an event (Requirement 7)
app.post('/api/events/:id/reviews', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userName, rating, comment } = req.body;

    const query = id.length === 24 ? { _id: new ObjectId(id) } : { id: id };
    const event = await eventsCollection.findOne(query);

    if (!event) {
       res.status(404).json({ error: 'Assembly not found.' });
       return;
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      userName,
      rating,
      comment,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      userInitials: userName.split(" ").map((n: string) => n[0]).join("").toUpperCase()
    };

    await eventsCollection.updateOne(query, {
      $push: { reviews: { $each: [newReview], $position: 0 } }
    });

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to log review.' });
  }
});

// ==========================================
// 🎟️ BOOKING APIs (Requirement 10 & 11)
// ==========================================

// 1. Get all bookings
app.get('/api/bookings', async (req: Request, res: Response) => {
  try {
    const bookings = await bookingsCollection.find({}).toArray();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets portfolio.' });
  }
});

// 2. Book tickets
app.post('/api/bookings', async (req: Request, res: Response) => {
  try {
    const { eventId, eventTitle, eventImage, quantity, price } = req.body;
    
    const eventQuery = eventId.length === 24 ? { _id: new ObjectId(eventId) } : { id: eventId };
    const event = await eventsCollection.findOne(eventQuery);

    if (!event) {
       res.status(404).json({ error: 'Assembly not found.' });
       return;
    }

    if (event.spotsLeft !== undefined && event.spotsLeft < quantity) {
       res.status(400).json({ error: 'No available passes left.' });
       return;
    }

    // Deduct available spots
    const newSpotsLeft = Math.max(0, (event.spotsLeft || 0) - quantity);
    await eventsCollection.updateOne(eventQuery, { $set: { spotsLeft: newSpotsLeft } });
    event.spotsLeft = newSpotsLeft;

    // Create booking transaction
    const newBooking = {
      id: `TX-${Math.floor(Math.random() * 900000) + 100000}`,
      eventId,
      eventTitle,
      eventImage,
      bookingDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      price
    };

    await bookingsCollection.insertOne(newBooking);

    res.status(201).json({ booking: newBooking, updatedEvent: event });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register reservation.' });
  }
});

// 3. Cancel booking
app.delete('/api/bookings/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await bookingsCollection.findOne({ id: id });

    if (!booking) {
       res.status(404).json({ error: 'Booking transaction not found.' });
       return;
    }

    // Restore original seat count
    const eventQuery = booking.eventId.length === 24 ? { _id: new ObjectId(booking.eventId) } : { id: booking.eventId };
    const event = await eventsCollection.findOne(eventQuery);
    if (event) {
      const restoredSpots = (event.spotsLeft || 0) + 1;
      await eventsCollection.updateOne(eventQuery, { $set: { spotsLeft: restoredSpots } });
    }

    // Remove the booking
    await bookingsCollection.deleteOne({ id: id });

    res.json({ message: 'Booking canceled successfully.', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to terminate booking pass.' });
  }
});

// Server boot-up logic for localhost
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Assembly Backend actively running on: http://localhost:${PORT}`);
  });
}

export default app;