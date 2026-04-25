/* eslint-disable @typescript-eslint/no-require-imports */
const bcrypt = require("bcryptjs");
const {
  PrismaClient,
  SocialPlatform,
  PortfolioStatus,
  UserRole,
} = require("@prisma/client");

try {
  process.loadEnvFile?.(".env");
} catch {}

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.RAILWAY_VOLUME_MOUNT_PATH
    ? `file:${process.env.RAILWAY_VOLUME_MOUNT_PATH}/dev.db`
    : "file:./dev.db";
}

const prisma = new PrismaClient();

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

async function main() {
  const demoPasswordHash = await hashPassword("Password123!");

  const categories = await Promise.all(
    [
      { name: "Mobile Development", sortOrder: 1 },
      { name: "Languages", sortOrder: 2 },
      { name: "Architecture", sortOrder: 3 },
      { name: "Product Delivery", sortOrder: 4 },
    ].map((category) =>
      prisma.skillCategory.upsert({
        where: { slug: slugify(category.name) },
        update: category,
        create: {
          ...category,
          slug: slugify(category.name),
        },
      }),
    ),
  );

  const user = await prisma.user.upsert({
    where: { email: "samandar@example.com" },
    update: {
      name: "Samandar Xasanov",
      username: "samandar-xasanov",
      role: UserRole.ADMIN,
      locale: "en",
      passwordHash: demoPasswordHash,
    },
    create: {
      name: "Samandar Xasanov",
      username: "samandar-xasanov",
      email: "samandar@example.com",
      role: UserRole.ADMIN,
      locale: "en",
      passwordHash: demoPasswordHash,
    },
  });

  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: {
      fullName: "Samandar Xasanov",
      title: "Flutter & Dart Mobile Developer",
      shortBio:
        "I build modern, scalable, and user-focused mobile applications using Flutter and Dart.",
      about:
        "Mobile engineer focused on thoughtful product delivery, polished UI systems, and maintainable Flutter architectures. I enjoy translating product goals into apps that feel fast, clear, and trustworthy for real users.",
      location: "Tashkent, Uzbekistan",
      mainStack: "Flutter, Dart",
      email: "fullcoder47@gmail.com",
      phone: "+998947704742",
      telegram: "https://t.me/samandarxasanov",
      github: "https://github.com/samandarxasanov",
      linkedIn: "https://www.linkedin.com/in/samandarxasanov",
      website: "https://samandar.dev",
      photoUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
      availability: "Open to mobile product engineering opportunities",
      isFeatured: true,
    },
    create: {
      userId: user.id,
      fullName: "Samandar Xasanov",
      title: "Flutter & Dart Mobile Developer",
      shortBio:
        "I build modern, scalable, and user-focused mobile applications using Flutter and Dart.",
      about:
        "Mobile engineer focused on thoughtful product delivery, polished UI systems, and maintainable Flutter architectures. I enjoy translating product goals into apps that feel fast, clear, and trustworthy for real users.",
      location: "Tashkent, Uzbekistan",
      mainStack: "Flutter, Dart",
      email: "fullcoder47@gmail.com",
      phone: "+998947704742",
      telegram: "https://t.me/samandarxasanov",
      github: "https://github.com/samandarxasanov",
      linkedIn: "https://www.linkedin.com/in/samandarxasanov",
      website: "https://samandar.dev",
      photoUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
      availability: "Open to mobile product engineering opportunities",
      isFeatured: true,
    },
  });

  await prisma.portfolioSettings.upsert({
    where: { profileId: profile.id },
    update: {
      status: PortfolioStatus.PUBLISHED,
      theme: "nocturne",
      accent: "cyan",
      seoTitle: "Samandar Xasanov | Flutter & Dart Mobile Developer",
      seoDescription:
        "Public portfolio for Samandar Xasanov, a Flutter & Dart mobile developer building scalable user-first apps.",
      showDiscover: true,
      showContactForm: true,
      spotlightText: "Building polished mobile products with Flutter and Dart.",
    },
    create: {
      profileId: profile.id,
      status: PortfolioStatus.PUBLISHED,
      theme: "nocturne",
      accent: "cyan",
      seoTitle: "Samandar Xasanov | Flutter & Dart Mobile Developer",
      seoDescription:
        "Public portfolio for Samandar Xasanov, a Flutter & Dart mobile developer building scalable user-first apps.",
      showDiscover: true,
      showContactForm: true,
      spotlightText: "Building polished mobile products with Flutter and Dart.",
    },
  });

  await prisma.contactSettings.upsert({
    where: { profileId: profile.id },
    update: {
      publicEmail: true,
      publicPhone: true,
      publicTelegram: true,
      allowContactForm: true,
      preferredLocale: "en",
      responseTime: "Usually replies within 24 hours",
    },
    create: {
      profileId: profile.id,
      publicEmail: true,
      publicPhone: true,
      publicTelegram: true,
      allowContactForm: true,
      preferredLocale: "en",
      responseTime: "Usually replies within 24 hours",
    },
  });

  await prisma.skill.deleteMany({ where: { profileId: profile.id } });
  await prisma.skill.createMany({
    data: [
      {
        profileId: profile.id,
        categoryId: categories[0].id,
        name: "Flutter",
        proficiency: "Expert",
        yearsOfExperience: 4,
        isCore: true,
        sortOrder: 1,
      },
      {
        profileId: profile.id,
        categoryId: categories[1].id,
        name: "Dart",
        proficiency: "Expert",
        yearsOfExperience: 4,
        isCore: true,
        sortOrder: 2,
      },
      {
        profileId: profile.id,
        categoryId: categories[2].id,
        name: "Clean Architecture",
        proficiency: "Advanced",
        yearsOfExperience: 3,
        isCore: true,
        sortOrder: 3,
      },
      {
        profileId: profile.id,
        categoryId: categories[3].id,
        name: "Product Delivery",
        proficiency: "Advanced",
        yearsOfExperience: 3,
        isCore: false,
        sortOrder: 4,
      },
    ],
  });

  await prisma.project.deleteMany({ where: { profileId: profile.id } });

  const projects = [
    {
      title: "FinTrack Mobile",
      shortDescription: "A sleek personal finance app for budgeting, analytics, and saving goals.",
      fullDescription:
        "Designed and shipped a Flutter mobile experience for daily budgeting with clean dashboards, spending categories, and shared household workspaces. Focused on fast startup time, practical onboarding, and accessible UX.",
      technologies: "Flutter, Dart, Firebase, REST API",
      imageUrl:
        "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80",
      githubUrl: "https://github.com/samandarxasanov/fintrack-mobile",
      liveUrl: "https://fintrack.example.com",
      playStoreUrl: "https://play.google.com/store/apps/details?id=fintrack.demo",
      featured: true,
      sortOrder: 1,
    },
    {
      title: "Courier Pulse",
      shortDescription: "A courier operations app with route tracking, delivery states, and team insights.",
      fullDescription:
        "Built a multi-role courier app that lets dispatch teams monitor route progress while drivers manage deliveries with offline-friendly flows. Emphasis was on resilient state handling and clear motion design.",
      technologies: "Flutter, Dart, SQLite, Maps SDK",
      imageUrl:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      githubUrl: "https://github.com/samandarxasanov/courier-pulse",
      liveUrl: "https://courierpulse.example.com",
      appStoreUrl: "https://apps.apple.com/app/id123456789",
      featured: true,
      sortOrder: 2,
    },
  ];

  for (const project of projects) {
    const createdProject = await prisma.project.create({
      data: {
        profileId: profile.id,
        slug: slugify(project.title),
        ...project,
      },
    });

    await prisma.projectImage.createMany({
      data: [
        {
          projectId: createdProject.id,
          imageUrl: project.imageUrl,
          altText: `${project.title} preview`,
          sortOrder: 1,
        },
      ],
    });
  }

  await prisma.experience.deleteMany({ where: { profileId: profile.id } });
  await prisma.experience.createMany({
    data: [
      {
        profileId: profile.id,
        company: "Nova Labs",
        role: "Senior Flutter Engineer",
        location: "Remote",
        startDate: new Date("2023-02-01"),
        currentRole: true,
        description:
          "Leading mobile architecture decisions, collaborating with product and design, and shipping premium Flutter experiences for SaaS products.",
        sortOrder: 1,
      },
      {
        profileId: profile.id,
        company: "Bright Apps Studio",
        role: "Flutter Developer",
        location: "Tashkent",
        startDate: new Date("2021-01-01"),
        endDate: new Date("2023-01-31"),
        currentRole: false,
        description:
          "Delivered client mobile apps, improved design system consistency, and introduced reusable state management patterns for shared modules.",
        sortOrder: 2,
      },
    ],
  });

  await prisma.education.deleteMany({ where: { profileId: profile.id } });
  await prisma.education.create({
    data: {
      profileId: profile.id,
      institution: "Tashkent University of Information Technologies",
      title: "BSc in Software Engineering",
      yearLabel: "2020",
      description: "Focused on software engineering, algorithms, and mobile systems.",
      sortOrder: 1,
    },
  });

  await prisma.certificate.deleteMany({ where: { profileId: profile.id } });
  await prisma.certificate.create({
    data: {
      profileId: profile.id,
      title: "Flutter Advanced UI",
      issuer: "Google Developers",
      yearLabel: "2024",
      description: "Advanced mobile interface systems, performance tuning, and state architecture.",
      credentialUrl: "https://developers.google.com",
      sortOrder: 1,
    },
  });

  await prisma.socialLink.deleteMany({ where: { profileId: profile.id } });
  await prisma.socialLink.createMany({
    data: [
      {
        profileId: profile.id,
        platform: SocialPlatform.TELEGRAM,
        label: "Telegram",
        url: "https://t.me/samandarxasanov",
        sortOrder: 1,
      },
      {
        profileId: profile.id,
        platform: SocialPlatform.GITHUB,
        label: "GitHub",
        url: "https://github.com/samandarxasanov",
        sortOrder: 2,
      },
      {
        profileId: profile.id,
        platform: SocialPlatform.LINKEDIN,
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/samandarxasanov",
        sortOrder: 3,
      },
      {
        profileId: profile.id,
        platform: SocialPlatform.WEBSITE,
        label: "Website",
        url: "https://samandar.dev",
        sortOrder: 4,
      },
    ],
  });

  console.info("Seed completed. Demo login: samandar@example.com / Password123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
