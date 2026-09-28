const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB Atlas unreachable (${error.message}). Falling back to MongoMemoryServer for development...`);
    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongod = await MongoMemoryServer.create();
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
