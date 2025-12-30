import { prismaClient } from "../lib/db";
import { auth } from "../lib/auth";

async function main() {

  await prismaClient.session.deleteMany();

  // Create demo user using better-auth's API (handles password hashing correctly)
  const signUpJohnDoeResult = await auth.api.signUpEmail({
    body: {
      email: "john.doe@taskify.com",
      password: "password123",
      name: "John Doe",
    },
  });

  if (!signUpJohnDoeResult) {
    throw new Error("Failed to create user");
  }

  const johnDoeUserId = signUpJohnDoeResult.user.id;
  console.log("Created user:", signUpJohnDoeResult.user);

    // Create demo user using better-auth's API (handles password hashing correctly)
  const signUpJaneDoeResult = await auth.api.signUpEmail({
    body: {
      email: "jane.doe@taskify.com",
      password: "password123",
      name: "Jane Doe",
    },
  });

  if (!signUpJaneDoeResult) {
    throw new Error("Failed to create user");
  }

  const janeDoeUserId = signUpJaneDoeResult.user.id;
  console.log("Created user:", signUpJaneDoeResult.user);

  // creating Task Statuses
  const inProgressStatus = await prismaClient.taskStatus.create({
    data: {
      name: "In Progress",
      sortOrder: 1,
    },
  })

  const inCompleteStatus = await prismaClient.taskStatus.create({
    data: {
      name: "Incomplete",
      sortOrder: 2,
    },
  })

  const doneStatus = await prismaClient.taskStatus.create({
    data: {
      name: "Done",
      sortOrder: 3,
    },
  })

  // Create demo projects with tasks
  const project1 = await prismaClient.project.create({
    data: {
      title: "Website Redesign",
      description: "Complete overhaul of company website with modern design",
      userId: janeDoeUserId,
      tasks: {
        create: [
          {
            title: "Design mockups",
            description: "Create initial design concepts and mockups",
            statusId: doneStatus.id,
          },
          {
            title: "Implement responsive layout",
            description: "Build responsive components for all screen sizes",
            statusId: inProgressStatus.id,
          },
          {
            title: "SEO optimization",
            description: "Optimize metadata and content for search engines",
            statusId: inCompleteStatus.id,
          },
        ],
      },
    },
  });

  const project2 = await prismaClient.project.create({
    data: {
      title: "Mobile App Development",
      description: "Build cross-platform mobile application using React Native",
      userId: johnDoeUserId,
      tasks: {
        create: [
          {
            title: "Setup development environment",
            description: "Configure React Native and required dependencies",
            statusId: doneStatus.id,
          },
          {
            title: "Build authentication flow",
            description: "Implement login, signup, and password reset",
            statusId: inProgressStatus.id,
          },
          {
            title: "Create user dashboard",
            description: "Design and implement main dashboard UI",
            statusId: inProgressStatus.id,
          },
          {
            title: "Integrate API endpoints",
            description: "Connect frontend to backend API",
            statusId: inCompleteStatus.id,
          },
        ],
      },
    },
  });

  const project3 = await prismaClient.project.create({
    data: {
      title: "Documentation Update",
      description: "Update all technical documentation for Q4",
      userId: johnDoeUserId,
      tasks: {
        create: [
          {
            title: "Review existing docs",
            description: "Audit current documentation for accuracy",
            statusId: doneStatus.id,
          },
          {
            title: "Write API documentation",
            description: "Document all REST API endpoints",
            statusId: inCompleteStatus.id,
          },
        ],
      },
    },
  });

  console.log("Created projects:", { project1, project2, project3 });
  console.log("\n✅ Database seeded successfully!");
  console.log("\nDemo credentials:");
  console.log("Email: john.doe@taskify.com");
  console.log("Password: password123");
  console.log("Email: jane.doe@taskify.com");
  console.log("Password: password123");
}

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
