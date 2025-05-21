const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create some initial challenges
  const challenges = [
    {
      title: "Daily Budget Check",
      description: "Review your daily spending and stay within budget",
      type: "DAILY",
      reward: 50,
      xpPoints: 10,
      difficulty: "EASY"
    },
    {
      title: "Weekly Savings Goal",
      description: "Save a specific amount this week",
      type: "WEEKLY",
      reward: 100,
      xpPoints: 25,
      difficulty: "MEDIUM"
    },
    {
      title: "Monthly Investment Review",
      description: "Review and adjust your investment portfolio",
      type: "MONTHLY",
      reward: 200,
      xpPoints: 50,
      difficulty: "HARD"
    },
    {
      title: "Track Daily Expenses",
      description: "Log all your expenses for the day",
      type: "DAILY",
      reward: 30,
      xpPoints: 15,
      difficulty: "EASY"
    },
    {
      title: "Emergency Fund Contribution",
      description: "Add to your emergency fund this week",
      type: "WEEKLY",
      reward: 150,
      xpPoints: 35,
      difficulty: "MEDIUM"
    },
    // New challenges
    {
      title: "No-Spend Day",
      description: "Complete a full day without spending any money",
      type: "DAILY",
      reward: 75,
      xpPoints: 20,
      difficulty: "MEDIUM"
    },
    {
      title: "Financial Education",
      description: "Read an article about financial planning or investment",
      type: "DAILY",
      reward: 40,
      xpPoints: 15,
      difficulty: "EASY"
    },
    {
      title: "Debt Reduction",
      description: "Make an extra payment towards your debt",
      type: "WEEKLY",
      reward: 120,
      xpPoints: 30,
      difficulty: "MEDIUM"
    },
    {
      title: "Investment Research",
      description: "Research and analyze a new investment opportunity",
      type: "MONTHLY",
      reward: 180,
      xpPoints: 45,
      difficulty: "HARD"
    },
    {
      title: "Expense Audit",
      description: "Review and categorize all expenses from last month",
      type: "MONTHLY",
      reward: 150,
      xpPoints: 40,
      difficulty: "MEDIUM"
    },
    {
      title: "Bill Payment",
      description: "Pay all your bills on time this month",
      type: "MONTHLY",
      reward: 100,
      xpPoints: 25,
      difficulty: "MEDIUM"
    },
    {
      title: "Smart Shopping",
      description: "Use coupons or discounts for all purchases today",
      type: "DAILY",
      reward: 60,
      xpPoints: 15,
      difficulty: "EASY"
    },
    {
      title: "Financial Goal Setting",
      description: "Set three new financial goals for the next quarter",
      type: "MONTHLY",
      reward: 120,
      xpPoints: 30,
      difficulty: "MEDIUM"
    },
    {
      title: "Tax Planning",
      description: "Review and optimize your tax strategy",
      type: "MONTHLY",
      reward: 200,
      xpPoints: 50,
      difficulty: "HARD"
    },
    {
      title: "Insurance Review",
      description: "Review and update your insurance coverage",
      type: "MONTHLY",
      reward: 150,
      xpPoints: 35,
      difficulty: "MEDIUM"
    }
  ];

  console.log('Starting to seed challenges...');

  for (const challenge of challenges) {
    try {
      await prisma.challenge.create({
        data: challenge
      });
      console.log(`Created challenge: ${challenge.title}`);
    } catch (error) {
      console.error(`Error creating challenge ${challenge.title}:`, error);
    }
  }

  console.log('Seed data creation completed');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 