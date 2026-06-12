import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Project from "@/models/Project";
import Skill from "@/models/Skill";
import Certificate from "@/models/Certificate";
import Experience from "@/models/Experience";
import Achievement from "@/models/Achievement";
import Setting from "@/models/Setting";
import {
  initialProjects,
  initialSkills,
  initialCertificates,
  initialExperiences,
  initialAchievements,
} from "@/data/mockData";

export async function GET() {
  try {
    await dbConnect();

    // 1. Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.create(initialProjects);
    }

    // 2. Skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      await Skill.create(initialSkills);
    }

    // 3. Certificates
    const certCount = await Certificate.countDocuments();
    if (certCount === 0) {
      await Certificate.create(initialCertificates);
    }

    // 4. Experiences
    const expCount = await Experience.countDocuments();
    if (expCount === 0) {
      await Experience.create(initialExperiences);
    }

    // 5. Achievements
    const achCount = await Achievement.countDocuments();
    if (achCount === 0) {
      await Achievement.create(initialAchievements);
    }

    // 6. Settings
    const settingCount = await Setting.countDocuments();
    if (settingCount === 0) {
      await Setting.create({
        aboutBio: "Computer Science Engineering Student passionate about Full Stack Development, Artificial Intelligence, Modern Web Technologies, and building impactful digital solutions.",
        careerObjective: "To leverage technical expertise in Full Stack Development and AI to build high-quality, high-performance web products that solve real-world problems.",
        githubUrl: "https://github.com/mohammedasim",
        linkedinUrl: "https://linkedin.com/in/mohammedasim",
      });
    }

    return NextResponse.json({ seeded: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
