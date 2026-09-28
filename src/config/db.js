const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Atlas Connection Failed: ${error.message}`);

    // In production (Render/Cloud), stop and guide the user to fix credentials in Atlas & Render
    if (process.env.NODE_ENV === "production" && process.env.ALLOW_IN_MEMORY_DB !== "true") {
      console.error(`\n🚨 CRITICAL RENDER / PRODUCTION ERROR:`);
      console.error(`MongoDB Atlas rejected the connection: "${error.message}"`);
      console.error(`👉 ACTION REQUIRED IN MONGODB ATLAS & RENDER DASHBOARD:`);
      console.error(`1. Go to cloud.mongodb.com -> Security -> Database Access`);
      console.error(`2. Check username/password for database user (e.g. rahul)`);
      console.error(`3. Go to Security -> Network Access -> Ensure 0.0.0.0/0 (Allow Access from Anywhere) is added`);
      console.error(`4. Update MONGO_URI in Render dashboard under Environment variables.\n`);
      process.exit(1);
    }

    console.warn(`⚠️ Falling back to MongoMemoryServer for development...`);
    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      // Use MongoDB 7.0.14 which is universally supported on Debian 12 (Render) and Windows
      const mongod = await MongoMemoryServer.create({
        binary: { version: "7.0.14" },
      });
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`✅ MongoDB In-Memory Server Connected: ${uri}`);

      const User = require("../models/User.model");
      const count = await User.countDocuments();
      if (count === 0) {
        console.log("🌱 Auto-seeding initial development data...");
        const { runSeed } = require("./seedHelper");
        await runSeed();
      }
    } catch (memErr) {
      console.error(`❌ Failed to start in-memory MongoDB: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
