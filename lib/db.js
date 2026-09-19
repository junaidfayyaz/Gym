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
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = (async () => {
      // 1. Try process.env.MONGO_URI if defined
      if (process.env.MONGO_URI) {
        try {
          const conn = await mongoose.connect(process.env.MONGO_URI, opts);
          console.log('✅ MongoDB Connected Successfully via MONGO_URI');

          // Auto-seed initial admin and demo data if database is newly created
          try {
            const Admin = (await import('../models/Admin')).default;
            const count = await Admin.countDocuments();
            if (count === 0) {
              console.log('🌱 Seeding initial admin and demo data into MongoDB Atlas...');
              const seedHelper = (await import('./seedHelper')).default;
              await seedHelper();
            }
          } catch (seedErr) {
            console.warn('Auto-seed check note:', seedErr.message);
          }

          return conn;
        } catch (err) {
          console.error('❌ MONGO_URI Connection Error:', err.message);
          if (process.env.NODE_ENV === 'production' || process.env.NETLIFY) {
            throw new Error(`MongoDB Atlas Connection Failed: ${err.message}`);
          }
        }
      }

      // 2. Try local MongoDB daemon if in local development
      if (process.env.NODE_ENV !== 'production' && !process.env.NETLIFY) {
        try {
          const localUri = 'mongodb://127.0.0.1:27017/gym_db';
          const conn = await mongoose.connect(localUri, opts);
          console.log(`✅ Local MongoDB Connected: ${mongoose.connection.host}`);
          return conn;
        } catch (err) {
          console.log('ℹ️ Local MongoDB service not active on machine.');
        }

        // 3. Mongo Memory Server (Local Dev Only)
        try {
          if (!cached.memoryInstance) {
            console.log('🚀 Launching Persistent In-Memory Database (HMR Safe)...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            cached.memoryInstance = await MongoMemoryServer.create();
          }
          const memoryUri = cached.memoryInstance.getUri();
          const conn = await mongoose.connect(memoryUri);
          console.log(`✅ Mongo Memory Database Connected at ${memoryUri}`);

          const Admin = (await import('../models/Admin')).default;
          const count = await Admin.countDocuments();
          if (count === 0) {
            console.log('🌱 Auto-populating zero-config memory database with PKR demo data...');
            const seedHelper = (await import('./seedHelper')).default;
            await seedHelper();
          }

          return conn;
        } catch (error) {
          console.error('❌ Mongoose Memory Server Error:', error.message);
          throw error;
        }
      }

      // If in production/Netlify and MONGO_URI is missing or unreachable
      throw new Error(
        'MONGO_URI Environment Variable is missing on Netlify! Please add MONGO_URI in Netlify Dashboard (Site Configuration > Environment Variables).'
      );
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
