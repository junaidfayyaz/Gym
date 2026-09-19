import mongoose from 'mongoose';

// Store connection and memory instance on globalThis to prevent HMR re-instantiation in Next.js dev mode
let cached = global._mongoose;

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null, memoryInstance: null };
}

export async function connectToDatabase() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      serverSelectionTimeoutMS: 2000,
    };

    const targetUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gym_db';

    cached.promise = (async () => {
      // 1. Try MongoDB Atlas if URI includes mongodb+srv
      if (process.env.MONGO_URI && process.env.MONGO_URI.includes('mongodb+srv')) {
        try {
          const conn = await mongoose.connect(process.env.MONGO_URI);
          console.log('✅ MongoDB Atlas Connected Successfully');
          return conn;
        } catch (err) {
          console.warn('⚠️ Atlas connection failed:', err.message);
        }
      }

      // 2. Try local MongoDB daemon
      try {
        const conn = await mongoose.connect(targetUri, opts);
        console.log(`✅ Local MongoDB Connected: ${mongoose.connection.host}`);
        return conn;
      } catch (err) {
        console.log('ℹ️ Local MongoDB service not active on machine.');
      }

      // 3. Persistent Mongo Memory Server Fallback attached to globalThis
      try {
        if (!cached.memoryInstance) {
          console.log('🚀 Launching Persistent In-Memory Database (HMR Safe)...');
          const { MongoMemoryServer } = require('mongodb-memory-server');
          cached.memoryInstance = await MongoMemoryServer.create();
        }
        const memoryUri = cached.memoryInstance.getUri();

        const conn = await mongoose.connect(memoryUri);
        console.log(`✅ Mongo Memory Database Connected at ${memoryUri}`);

        // Seed initial data if database is newly created
        const Admin = (await import('../models/Admin')).default;
        const count = await Admin.countDocuments();
        if (count === 0) {
          console.log('🌱 Auto-populating zero-config memory database with PKR demo data...');
          const seedHelper = (await import('./seedHelper')).default;
          await seedHelper();
        }

        return conn;
      } catch (error) {
        console.error('❌ Mongoose Connection Error:', error.message);
        throw error;
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
