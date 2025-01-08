require("dotenv").config();

const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const expressLayouts = require("express-ejs-layouts");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const methodOverride = require("method-override");
const session = require("express-session");

const connectDB = require("./server/config/db");
connectDB();
const challenge = require("./server/models/challenge");

const challenges = [
  {
    title: "Zero Sugar for 7 Days",
    desc: "Avoid all forms of added sugar for an entire week. No sugary drinks, snacks, or processed foods.",
    category: "Health",
    released: "on",
  },
  {
    title: "30-Minute Daily Walk",
    desc: "Commit to walking for at least 30 minutes every day for a month.",
    category: "Fitness",
    released: "on",
  },
  {
    title: "Random Acts of Kindness",
    desc: "Perform 3 random acts of kindness for strangers each day for a week.",
    category: "Social",
    released: "on",
  },
  {
    title: "No Screen Sunday",
    desc: "Spend an entire Sunday without using any screens (phones, computers, TV, etc.).",
    category: "Lifestyle",
    released: "on",
  },
  {
    title: "Declutter Your Space",
    desc: "Declutter one area of your home (closet, kitchen, desk, etc.) every day for 7 days.",
    category: "Productivity",
    released: "on",
  },
  {
    title: "Read for 30 Minutes a Day",
    desc: "Read at least 30 minutes every day for 30 days, any genre or topic of your choice.",
    category: "Self-Improvement",
    released: "on",
  },
  {
    title: "No Complaints for a Week",
    desc: "Try to go an entire week without complaining about anything, focusing on positivity.",
    category: "Mental Health",
    released: "on",
  },
  {
    title: "Master a New Skill",
    desc: "Dedicate 20 minutes a day to learning a new skill (language, instrument, coding, etc.) for 30 days.",
    category: "Learning",
    released: "on",
  },
  {
    title: "Digital Detox for 48 Hours",
    desc: "Completely disconnect from all digital devices (phone, computer, TV, etc.) for a full 48 hours.",
    category: "Wellness",
    released: "on",
  },
  {
    title: "30-Day Gratitude Journal",
    desc: "Write down three things you're grateful for every day for 30 days.",
    category: "Mindfulness",
    released: "on",
  },
  {
    title: "Cook a New Recipe Every Week",
    desc: "Try cooking one new recipe from a different cuisine every week for a month.",
    category: "Food",
    released: "on",
  },
  {
    title: "Take Cold Showers for 7 Days",
    desc: "Commit to taking cold showers every morning for a week.",
    category: "Fitness",
    released: "on",
  },
  {
    title: "No Fast Food for 30 Days",
    desc: "Avoid all fast food restaurants and take-out for an entire month.",
    category: "Health",
    released: "on",
  },
  {
    title: "Sleep 8 Hours Every Night",
    desc: "Prioritize sleep and ensure you're getting 8 hours of rest every night for 30 days.",
    category: "Lifestyle",
    released: "on",
  },
  {
    title: "Give Up One Bad Habit",
    desc: "Identify one bad habit (smoking, excessive screen time, junk food, etc.) and eliminate it for 30 days.",
    category: "Self-Improvement",
    released: "on",
  },
  {
    title: "No Caffeine for 14 Days",
    desc: "Eliminate caffeine from your diet for two full weeks.",
    category: "Health",
    released: "on",
  },
  {
    title: "Walk 10,000 Steps a Day",
    desc: "Track your steps and walk at least 10,000 steps every day for 30 days.",
    category: "Fitness",
    released: "on",
  },
  {
    title: "Volunteer for 10 Hours",
    desc: "Give back to your community by volunteering for 10 hours in total over the next month.",
    category: "Social",
    released: "on",
  },
  {
    title: "No Alcohol for 30 Days",
    desc: "Avoid consuming alcohol for an entire month.",
    category: "Health",
    released: "on",
  },
  {
    title: "30 Days of Meditation",
    desc: "Commit to meditating for 10 minutes every day for 30 consecutive days.",
    category: "Mindfulness",
    released: "on",
  },
];

// Async function to handle database operations
async function createChallenges() {
  for (const c of challenges) {
    const newChallenge = {
      title: c.title,
      desc: c.desc,
      category: c.category,
      released: true, // Changed to true as it seems more appropriate (adjust if needed)
    };

    try {
      await challenge.create(newChallenge); // Assuming create() returns a promise
      console.log(`Challenge "${c.title}" created successfully.`);
    } catch (error) {
      console.error(`Error creating challenge "${c.title}":`, error);
    }
  }
  return;
}

// Call the async function to create challenges
createChallenges();
