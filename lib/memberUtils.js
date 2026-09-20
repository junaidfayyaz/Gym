import Member from '@/models/Member';

/**
 * Generates the next sequential unique Member ID starting from WS-7001 (WS-7001, WS-7002, WS-7003...)
 */
export async function generateNextMemberId() {
  const count = await Member.countDocuments();
  const lastMember = await Member.findOne({ memberId: { $regex: '^WS-' } })
    .sort({ createdAt: -1 })
    .lean();

  let nextNum = 7001 + count;

  if (lastMember && lastMember.memberId) {
    const match = lastMember.memberId.match(/WS-(\d+)/);
    if (match) {
      nextNum = Math.max(nextNum, parseInt(match[1], 10) + 1);
    }
  }

  return `WS-${nextNum}`;
}

let lastSync = global._lastStatusSync || 0;

/**
 * Automatically syncs member status based on current date and plan expiration date (endDate).
 * Throttled to run at most once every 3 minutes per serverless container lifespan to ensure sub-second tab switching.
 */
export async function syncMemberStatuses(force = false) {
  const nowTime = Date.now();
  if (!force && nowTime - lastSync < 3 * 60 * 1000) {
    return;
  }
  global._lastStatusSync = nowTime;
  lastSync = nowTime;

  const now = new Date();
  await Member.updateMany(
    { status: { $ne: 'suspended' }, endDate: { $lt: now } },
    { $set: { status: 'expired' } }
  );
  await Member.updateMany(
    { status: 'expired', endDate: { $gte: now } },
    { $set: { status: 'active' } }
  );
}
