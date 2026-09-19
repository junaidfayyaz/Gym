const { connectToDatabase } = require('../lib/db');

async function runSeed() {
  try {
    await connectToDatabase();
    const seedHelper = (await import('../lib/seedHelper')).default;
    await seedHelper();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Failure:', err);
    process.exit(1);
  }
}

runSeed();
