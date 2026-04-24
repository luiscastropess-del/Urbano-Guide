
import { db } from './lib/prisma';

async function main() {
  try {
    const adminEmail = "luiscastropess@gmail.com";
    
    // Garantir que todos os outros usuários sejam convertidos para 'user' e só este seja 'admin'
    await db.user.updateMany({
      where: {
        NOT: { email: adminEmail }
      },
      data: {
        role: "user"
      }
    });

    const adminUser = await db.user.findUnique({
      where: { email: adminEmail }
    });

    if (adminUser) {
      await db.user.update({
        where: { email: adminEmail },
        data: { role: "admin" }
      });
      console.log(`User ${adminEmail} updated to ADMIN successfully.`);
    } else {
      console.log(`User ${adminEmail} not found in database to update.`);
    }
  } catch (error) {
    console.error('Update failed:', error);
  } finally {
    process.exit();
  }
}

main();
