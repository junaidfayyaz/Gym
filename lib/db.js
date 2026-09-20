import mongoose from 'mongoose';

// Store connection cache on globalThis for Next.js / Serverless instance reuse
let cached = global._mongoose;

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  // 1. Immediate return if already connected
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri && (process.env.NODE_ENV === 'production' || process.env.NETLIFY)) {
      throw new Error(
        'MONGO_URI Environment Variable is missing on Netlify! Please add MONGO_URI in Netlify Dashboard (Site Configuration > Environment Variables).'
      );
    }

    cached.promise = (async () => {
      // Production / Netlify / Atlas connection path
      if (mongoUri) {
        const conn = await mongoose.connect(mongoUri, opts);
        console.log('✅ MongoDB Atlas Connected');

        // Run seed check at most once per process lifespan
        if (!global._hasSeeded) {
          global._hasSeeded = true;
          try {
            const Admin = (await import('../models/Admin')).default;
            const count = await Admin.countDocuments();
            if (count === 0) {
              console.log('🌱 Seeding initial admin and demo data into MongoDB Atlas...');
              const seedHelper = (await import('./seedHelper')).default;
              await seedHelper();
            }
          } catch (e) {
            console.warn('Seed check note:', e.message);
          }
        }

        return conn;
      }

      // Local Dev Only Fallbacks
      if (process.env.NODE_ENV !== 'production' && !process.env.NETLIFY) {
        try {
          const conn = await mongoose.connect('mongodb://127.0.0.1:27017/gym_db', opts);
          return conn;
        } catch (e) {}

        const { MongoMemoryServer } = require('mongodb-memory-server');
        if (!cached.memoryInstance) {
          cached.memoryInstance = await MongoMemoryServer.create();
        }
        const memoryUri = cached.memoryInstance.getUri();
        const conn = await mongoose.connect(memoryUri, opts);

        if (!global._hasSeeded) {
          global._hasSeeded = true;
          const Admin = (await import('../models/Admin')).default;
          if ((await Admin.countDocuments()) === 0) {
            const seedHelper = (await import('./seedHelper')).default;
            await seedHelper();
          }
        }
        return conn;
      }

      throw new Error('MONGO_URI is missing');
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
