/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Review {
  id: string;
  userName: string;
  userRole: string;
  userInitials: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  description: string;
}

export interface DaySchedule {
  dayTitle: string;
  date: string;
  items: ScheduleItem[];
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category:
    | "Music"
    | "Tech"
    | "Business"
    | "Arts"
    | "Food"
    | "Design"
    | "Sports"
    | "Networking";
  tag: string;
  date: string;
  displayDate: string;
  location: string;
  price: number; // 0 for Free
  image: string;
  spotsLeft?: number;
  organizer: {
    name: string;
    eventsHosted: number;
    logo: string;
  };
  schedule?: DaySchedule[];
  reviews?: Review[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "Premium Member" | "Administrator";
  password?: string;
}

export interface Booking {
  id: string;
  eventId: string;
  eventTitle: string;
  eventImage: string;
  bookingDate: string;
  price: number;
}
