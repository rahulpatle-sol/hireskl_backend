/**
 * Skill1 Hire — Comprehensive Seed Script (Wipes DB and creates all role types)
 * Usage: node seed.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    console.log("🧹 Wiping completely fresh starting state...");
    await mongoose.connection.db.dropDatabase();
    console.log("🗑️  Database cleared.");

    const User = require("./src/models/User.model");
    const { Domain, Skill } = require("./src/models/Domain.model");
    const CandidateProfile = require("./src/models/CandidateProfile.model");
    const HRProfile = require("./src/models/HRProfile.model");
    const MentorProfile = require("./src/models/MentorProfile.model");
    const ManagerProfile = require("./src/models/ManagerProfile.model");
    const Job = require("./src/models/Job.model");
    const Assignment = require("./src/models/Assignment.model");
    const Application = require("./src/models/Application.model");
const { Assessment } = require("./src/models/Assessment.model");
const Chat = require("./src/models/Chat.model");
const Message = require("./src/models/Message.model");

// Let the User model pre-save hash this!
    const baseUser = { password: "Test@1234", isEmailVerified: true, isVerified: true, isActive: true };

    // ── 1. Master Admin ──────────────────────────────────────
    await User.create({ name: "Master Admin Mitra", email: "master@test.com", role: "master", ...baseUser });
    console.log("👑 Master Admin created — master@test.com");

    // ── 2. Standard Admin ────────────────────────────────────
    const adminUser = await User.create({ name: "System Admin Aditi", email: "admin@test.com", role: "admin", ...baseUser });
    console.log("🛠️  Admin created — admin@test.com");

    // ── 3. Domain & Skill ────────────────────────────────────
    const domain = await Domain.create({
      name: "Software Engineering",
      slug: "software-engineering",
      description: "Code and architecture.",
    });
    const skill = await Skill.create({
      name: "JavaScript",
      slug: "javascript",
      domain: domain._id,
      description: "JavaScript programming language",
    });
    console.log("📁 Domain & Skill created");

    // ── 4. Manager ────────────────────────────────────────────
    const mgrUser = await User.create({
      name: "Domain Manager Rahul",
      email: "manager@test.com",
      role: "manager",
      ...baseUser,
    });
    await ManagerProfile.create({
      user: mgrUser._id,
      createdBy: adminUser._id,
      domains: [domain._id],
      title: "Software Engineering Domain Lead",
      bio: "Overseeing candidate assessments and technical assignments.",
    });
    console.log("🗂️  Manager & ManagerProfile created — manager@test.com");

    // ── 5. HR / Recruiter ────────────────────────────────────
    const hrUser = await User.create({
      name: "Priya HR Recruiter",
      email: "hr@test.com",
      role: "hr",
      ...baseUser,
    });
    await HRProfile.create({
      user: hrUser._id,
      companyName: "TechCorp India",
      designation: "Talent Lead",
      location: "Bangalore",
      skills: ["Hiring", "JavaScript"],
      plan: "pro",
      isPremium: true,
      isVerified: true,
      verificationStatus: "verified",
    });
    console.log("👔 HR/Recruiter created — hr@test.com");

    // ── 6. Mentor ────────────────────────────────────────────
    const mUser = await User.create({
      name: "Siddharth Mentor",
      email: "mentor@test.com",
      role: "mentor",
      ...baseUser,
    });
    await MentorProfile.create({
      user: mUser._id,
      company: "Amazon",
      role: "Senior Software Engineer",
      hourlyRate: 50,
      skills: ["System Design", "AWS", "Java", "Node.js"],
      bio: "Staff engineer at Amazon with 8 YOE.",
      isVerified: true,
      rating: 4.8,
      totalSessions: 12,
    });
    console.log("🌟 Mentor created — mentor@test.com");

    // ── 7. Candidate ─────────────────────────────────────────
    const cUser = await User.create({
      name: "Mitra Candidate",
      email: "candidate@test.com",
      role: "candidate",
      ...baseUser,
    });
    await CandidateProfile.create({
      user: cUser._id,
      headline: "Full-Stack Developer | React & Node.js",
      bio: "Building real products.",
      location: "Delhi, India",
      overallScore: 72,
      profileCompleteness: 85,
      education: [
        {
          institution: "IIT Delhi",
          degree: "B.Tech",
          fieldOfStudy: "CSE",
          startYear: 2019,
          endYear: 2023,
        },
      ],
      experience: [
        {
          company: "Startup X",
          role: "Frontend Intern",
          startDate: new Date("2022-06-01"),
          endDate: new Date("2022-09-01"),
          isCurrent: false,
          description: "Built the landing page.",
        },
      ],
      certifications: [
        {
          name: "AWS CCP",
          issuer: "Amazon",
          issueDate: new Date("2023-01-10"),
        },
      ],
      isVerified: true,
      verificationStatus: "verified",
    });
    console.log("🎓 Candidate created — candidate@test.com");

    // ── 8. Job ───────────────────────────────────────────────
    const job = await Job.create({
      title: "Frontend Developer",
      description: "We are looking for a talented Frontend Developer to join our team.",
      requirements: ["3+ years React experience", "Strong JavaScript skills"],
      responsibilities: ["Build user-facing features", "Collaborate with design team"],
      requiredSkills: [skill._id],
      preferredSkills: [],
      domain: domain._id,
      jobType: "full-time",
      workMode: "remote",
      experienceLevel: "mid",
      minExperience: 2,
      maxExperience: 5,
      location: "Bangalore, India",
      salaryMin: 800000,
      salaryMax: 1500000,
      salaryCurrency: "INR",
      isNegotiable: true,
      isSalaryHidden: false,
      applicationDeadline: new Date("2024-12-31"),
      totalOpenings: 2,
      status: "active",
      isExternalJob: false,
      requiresVerification: true,
      totalApplications: 0,
      totalViews: 0,
      postedBy: adminUser._id,
    });
    console.log("💼 Job created");

    // ── 9. Application ───────────────────────────────────────
    const application = await Application.create({
      job: job._id,
      candidate: cUser._id,
      candidateProfile: cUser._id,
      coverLetter: "I am very interested in this position and believe my skills match well.",
      resumeUrl: "https://example.com/resume.pdf",
      status: "applied",
    });
    console.log("📝 Application created");

    // ── 10. Assessment ───────────────────────────────────────
    const assessment = await Assessment.create({
      title: "JavaScript Fundamentals Test",
      description: "Test core JavaScript concepts",
      domain: domain._id,
      skill: skill._id,
      level: "beginner",
      questions: [
        {
          questionText: "What is a closure in JavaScript?",
          type: "mcq",
          options: [
            "A function bundled with its lexical environment",
            "A variable declared inside a function",
            "An object with methods",
            "A loop structure",
          ],
          correctAnswer: 0,
          explanation: "A closure gives you access to an outer function's scope from an inner function.",
          marks: 1,
        },
        {
          questionText: "Which of the following is not a JavaScript data type?",
          type: "mcq",
          options: ["String", "Number", "Boolean", "Integer"],
          correctAnswer: 3,
          explanation: "Integer is not a distinct data type in JavaScript; numbers are all " + "of the type Number.",
          marks: 1,
        },
      ],
      totalMarks: 2,
      passingMarks: 1,
      durationMinutes: 30,
      isActive: true,
      createdBy: adminUser._id,
    });
    console.log("❓ Assessment created");

    // ── 11. Assignment ───────────────────────────────────────
    const assignment = await Assignment.create({
      title: "Build a Todo App",
      description: "Build a simple todo application with React",
      domain: domain._id,
      assignedTo: cUser._id,
      assignedBy: adminUser._id,
      dueDate: new Date("2024-11-30"),
      githubRequired: true,
      status: "pending",
    });
    console.log("📋 Assignment created");

    // ── 12. Chat ─────────────────────────────────────────────
    const chat = await Chat.create({
      participants: [mgrUser._id, cUser._id],
      isGroupChat: false,
    });
    console.log("💬 Chat created");

    // ── 13. Message ──────────────────────────────────────────
    await Message.create({
      sender: mUser._id,
      chat: chat._id,
      text: "Hello! Let's discuss the assignment.",
    });
    console.log("📨 Message created");

    console.log("\n🔑 ALL LOGIN CREDENTIALS:");
    console.log("All accounts use the same password: Test@1234\n");
    console.log("  Master   → master@test.com");
    console.log("  Admin    → admin@test.com");
    console.log("  Manager  → manager@test.com");
    console.log("  HR       → hr@test.com");
    console.log("  Mentor   → mentor@test.com");
    console.log("  Candidate→ candidate@test.com");

    console.log("\n✅ Database fresh seed completed successfully!");
  } catch (err) {
    console.error("❌ Seed failed:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();