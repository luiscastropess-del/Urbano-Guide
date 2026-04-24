
import { db } from './lib/prisma';

async function main() {
  try {
    const count = await db.user.count();
    console.log(`Connection successful. User count: ${count}`);
    const firstUser = await db.user.findFirst();
    if (firstUser) {
      console.log(`First user: ${firstUser.email} (Role: ${firstUser.role})`);
    } else {
      console.log('No users found in database.');
    }
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    process.exit();
  }
}

main();
