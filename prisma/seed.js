const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create initial challenges
  const challenges = [
    {
      title: 'No Spend Day',
      description: 'Complete a full day without spending any money',
      type: 'DAILY',
      reward: 20,
      xpPoints: 15,
      difficulty: 'MEDIUM'
    },
    {
      title: 'Track 5 Expenses',
      description: 'Log 5 expenses in a single day',
      type: 'DAILY',
      reward: 10,
      xpPoints: 10,
      difficulty: 'EASY'
    },
    {
      title: 'Create a Budget',
      description: 'Set up your first monthly budget',
      type: 'MONTHLY',
      reward: 50,
      xpPoints: 30,
      difficulty: 'EASY'
    },
    {
      title: 'Save ₹1000 This Week',
      description: 'Cut back on expenses and save ₹1000 in one week',
      type: 'WEEKLY',
      reward: 100,
      xpPoints: 50,
      difficulty: 'HARD'
    },
    {
      title: 'Financial Education',
      description: 'Read an article about financial planning',
      type: 'DAILY',
      reward: 15,
      xpPoints: 10,
      difficulty: 'EASY'
    },
    {
      title: 'Expense Categorization',
      description: 'Categorize all of your expenses from last month',
      type: 'MONTHLY',
      reward: 50,
      xpPoints: 25,
      difficulty: 'MEDIUM'
    },
    {
      title: 'Emergency Fund',
      description: 'Start building your emergency fund by transferring ₹500',
      type: 'WEEKLY',
      reward: 30,
      xpPoints: 20,
      difficulty: 'MEDIUM'
    },
    {
      title: 'Bill Payment',
      description: 'Pay all your bills on time this month',
      type: 'MONTHLY',
      reward: 40,
      xpPoints: 20,
      difficulty: 'MEDIUM'
    }
  ];

  for (const challenge of challenges) {
    await prisma.challenge.upsert({
      where: { 
        id: challenge.title.toLowerCase().replace(/\s+/g, '-')
      },
      update: {},
      create: {
        id: challenge.title.toLowerCase().replace(/\s+/g, '-'),
        ...challenge
      }
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 