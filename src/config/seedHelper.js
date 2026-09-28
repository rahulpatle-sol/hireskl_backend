const mongoose = require("mongoose");
const User = require("../models/User.model");
const CandidateProfile = require("../models/CandidateProfile.model");
const HRProfile = require("../models/HRProfile.model");
const MentorProfile = require("../models/MentorProfile.model");
const ManagerProfile = require("../models/ManagerProfile.model");
const { Domain, Skill } = require("../models/Domain.model");
const Job = require("../models/Job.model");
const { Assessment } = require("../models/Assessment.model");

async function runSeed() {
  try {
    const baseUser = { password: "Test@1234", isEmailVerified: true, isVerified: true, isActive: true };

    // 1. Domains & Skills
    const devDomain = await Domain.create({
      name: "Software Engineering",
      slug: "software-engineering",
      description: "Full-stack development, cloud architecture, and distributed systems.",
      isActive: true,
    });
    const dsDomain = await Domain.create({
      name: "Data Science & AI",
      slug: "data-science-ai",
      description: "Machine learning, analytics, and deep learning engineering.",
      isActive: true,
    });

    const reactSkill = await Skill.create({ name: "React.js", slug: "react-js", domain: devDomain._id });
    const nodeSkill = await Skill.create({ name: "Node.js", slug: "node-js", domain: devDomain._id });
    const mongoSkill = await Skill.create({ name: "MongoDB", slug: "mongodb", domain: devDomain._id });

    // 2. Master & Admin
    await User.create({ name: "Master Admin Mitra", email: "master@test.com", role: "master", ...baseUser });
    const adminUser = await User.create({ name: "System Admin Aditi", email: "admin@test.com", role: "admin", ...baseUser });

    // 3. Manager
    const mgrUser = await User.create({ name: "Domain Manager Rahul", email: "manager@test.com", role: "manager", ...baseUser });
    await ManagerProfile.create({
      user: mgrUser._id,
      createdBy: adminUser._id,
      domains: [devDomain._id],
      title: "Software Engineering Domain Lead",
      bio: "Overseeing candidate assessments and code evaluations.",
    });

    // 4. HR Recruiter
    const hrUser = await User.create({ name: "Priya HR Recruiter", email: "hr@test.com", role: "hr", ...baseUser });
    const hrProfile = await HRProfile.create({
      user: hrUser._id,
      companyName: "TechCorp India",
      website: "https://techcorp.example.com",
      designation: "Talent Acquisition Lead",
      location: "Bangalore, India",
      skills: ["Hiring", "Technical Recruitment"],
      plan: "pro",
      isPremium: true,
      isVerified: true,
      verificationStatus: "verified",
    });

    // 5. Mentor
    const mUser = await User.create({ name: "Siddharth Mentor", email: "mentor@test.com", role: "mentor", ...baseUser });
    await MentorProfile.create({
      user: mUser._id,
      company: "Amazon",
      role: "Senior Software Engineer",
      hourlyRate: 50,
      skills: ["System Design", "AWS", "Node.js"],
      bio: "Staff engineer with 8+ years experience guiding developers.",
      isVerified: true,
      rating: 4.9,
      avgRating: 4.9,
      totalSessions: 18,
    });

    // 6. Candidate
    const cUser = await User.create({ name: "Mitra Candidate", email: "candidate@test.com", role: "candidate", ...baseUser });
    await CandidateProfile.create({
      user: cUser._id,
      publicSlug: "mitra-candidate",
      headline: "Full-Stack Engineer | React & Node.js",
      bio: "Passionate engineer with high proficiency in microservices and modern web tech.",
      location: "Delhi, India",
      domains: [devDomain._id],
      skills: [reactSkill._id, nodeSkill._id, mongoSkill._id],
      overallScore: 82,
      profileCompleteness: 90,
      isVerified: true,
      verifiedBadge: true,
      verificationStatus: "verified",
      streakDays: 4,
      lastActiveDate: new Date(),
      capstoneProject: {
        title: "Distributed Task Scheduler",
        description: "Built high-throughput distributed worker queue with Redis and Node.js.",
        repoUrl: "https://github.com/example/scheduler",
        liveUrl: "https://scheduler.example.com",
        status: "approved",
      },
      education: [{ institution: "IIT Delhi", degree: "B.Tech Computer Science", startYear: 2019, endYear: 2023 }],
      experience: [{ company: "Innovate Labs", role: "Software Engineer Intern", startDate: new Date("2023-01-01"), isCurrent: false, description: "Engineered scalable REST APIs." }],
      certifications: [{ name: "AWS Certified Developer", issuer: "Amazon Web Services", issueDate: new Date("2023-08-15") }],
    });

    // 7. Sample Jobs
    await Job.create({
      title: "Senior Full Stack Engineer",
      slug: "senior-full-stack-engineer",
      postedBy: hrUser._id,
      companyName: "TechCorp India",
      domain: devDomain._id,
      requiredSkills: [reactSkill._id, nodeSkill._id],
      jobType: "full-time",
      workMode: "remote",
      experienceLevel: "senior",
      description: "Join our core platform engineering team building next-generation talent infrastructure.",
      salary: { min: 2400000, max: 3600000, currency: "INR" },
      totalOpenings: 3,
      status: "active",
      requiresVerification: true,
    });

    await Job.create({
      title: "Backend Node.js Developer",
      slug: "backend-nodejs-developer",
      postedBy: hrUser._id,
      companyName: "TechCorp India",
      domain: devDomain._id,
      requiredSkills: [nodeSkill._id, mongoSkill._id],
      jobType: "full-time",
      workMode: "hybrid",
      experienceLevel: "mid",
      description: "Scale our real-time messaging pipeline and GraphQL query optimizers.",
      salary: { min: 1400000, max: 2000000, currency: "INR" },
      totalOpenings: 2,
      status: "active",
      requiresVerification: false,
    });

    // 8. Sample Assessment
    await Assessment.create({
      title: "Node.js Core & Concurrency Assessment",
      domain: devDomain._id,
      skill: nodeSkill._id,
      level: "intermediate",
      durationMinutes: 30,
      totalMarks: 20,
      passingMarks: 12,
      questions: [
        {
          questionText: "Which mechanism allows Node.js to perform non-blocking I/O operations despite being single-threaded?",
          type: "mcq",
          options: ["Event Loop and Libuv", "Multi-threading worker pools only", "Kernel preemptive multitasking", "Synchronous thread spawning"],
          correctAnswer: 0,
          marks: 10,
        },
        {
          questionText: "What will happen if process.nextTick() is called recursively in an infinite loop?",
          type: "mcq",
          options: ["It will starve the Event Loop and block I/O operations", "It runs asynchronously in background threads", "It throws a StackOverflowError immediately", "Node.js ignores after 100 iterations"],
          correctAnswer: 0,
          marks: 10,
        },
      ],
      createdBy: adminUser._id,
    });

    console.log("🌱 In-memory database auto-seeded successfully with 6 roles, jobs, assessments, and domains!");
  } catch (err) {
    console.error("❌ Seed helper failed:", err.message);
  }
}

module.exports = { runSeed };
