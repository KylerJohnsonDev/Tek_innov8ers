import { prismaClient } from "@/lib/db";



async function main() {

  // Create demo user
  const userOne = await prismaClient.user.upsert({
    where: { id: "demo-user-john-doe" },
    update: {},
    create: {
      id: "demo-user-john-doe",
      email: "john.doe@taskify.com",
      name: "John Doe",
    },
  });

  console.log(`Demo user (${userOne.name}) created`, userOne);

  const userTwo = await prismaClient.user.upsert({
    where: { id: "demo-user-jane-doe" },
    update: {},
    create: {
      id: "demo-user-jane-doe",
      email: "jane.doe@taskify.com",
      name: "Jane Doe",
    },
  });

  console.log(`Demo user (${userTwo.name}) created`, userTwo);

  // Create demo projects with tasks
  const project1 = await prismaClient.project.create({
    data: {
      title: "Website Redesign",
      description: "Complete overhaul of company website with modern design",
      userId: userOne.id,
      tasks: {
        create: [
          {
            title: "Design mockups",
            description: "Create initial design concepts and mockups",
            status: "Done",
          },
          {
            title: "Implement responsive layout",
            description: "Build responsive components for all screen sizes",
            status: "In Progress",
          },
          {
            title: "SEO optimization",
            description: "Optimize metadata and content for search engines",
            status: "Incomplete",
          },
        ],
      },
    },
  });

  const project2 = await prismaClient.project.create({
    data: {
      title: "Mobile App Development",
      description: "Build cross-platform mobile application using React Native",
      userId: userOne.id,
      tasks: {
        create: [
          {
            title: "Setup development environment",
            description: "Configure React Native and required dependencies",
            status: "Done",
          },
          {
            title: "Build authentication flow",
            description: "Implement login, signup, and password reset",
            status: "In Progress",
          },
          {
            title: "Create user dashboard",
            description: "Design and implement main dashboard UI",
            status: "In Progress",
          },
          {
            title: "Integrate API endpoints",
            description: "Connect frontend to backend API",
            status: "Incomplete",
          },
        ],
      },
    },
  });

  const project3 = await prismaClient.project.create({
    data: {
      title: "Documentation Update",
      description: "Update all technical documentation for Q4",
      userId: userTwo.id,
      tasks: {
        create: [
          {
            title: "Review existing docs",
            description: "Audit current documentation for accuracy",
            status: "Done",
          },
          {
            title: "Write API documentation",
            description: "Document all REST API endpoints",
            status: "Incomplete",
          },
        ],
      },
    },
  });

  console.log("Created projects:", { project1, project2, project3 });
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
