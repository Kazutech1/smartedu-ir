// prisma/seed.mjs
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
// ✅ Use legacy build for Node.js
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const prisma = new PrismaClient();

// Read CSV file
function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

// ✅ Extract text from first 2 pages only (better relevance)
async function extractPDFText(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const pdfDoc = await pdfjsLib.getDocument({ data }).promise;

  let text = "";
  const pageLimit = Math.min(pdfDoc.numPages, 2); // only 2 pages

  for (let i = 1; i <= pageLimit; i++) {
    const page = await pdfDoc.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(" ") + "\n";
  }
  return text.trim();
}

// ✅ Parse all PDFs
async function parsePDFs(folderPath) {
  const files = fs.readdirSync(folderPath).filter((f) => f.endsWith(".pdf"));
  const documents = [];

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const rawText = await extractPDFText(filePath);

    documents.push({
      filename: file,
      filePath: `/data/pdfs/${file}`,
      mimeType: "application/pdf",
      rawText: rawText.slice(0, 2000), // Trim for DB efficiency
      fileSize: fs.statSync(filePath).size,
      uploadedAt: new Date(),
    });
  }
  return documents;
}

// ✅ Main Seeder
async function main() {
  console.log("🌱 Seeding SmartEdU database...\n");

  // Admin user
  let admin = await prisma.user.findUnique({
    where: { email: "grace.mensah@smartedu.ac.uk" },
  });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        name: "Dr. Grace Mensah",
        email: "grace.mensah@smartedu.ac.uk",
        role: "admin",
      },
    });
  }
  console.log("✅ Admin ready");

  // Courses
  await prisma.course.deleteMany();
  await prisma.course.createMany({
    data: [
      { code: "MATH101", title: "Mathematics", semester: "Fall", year: 2025 },
      { code: "READ102", title: "Reading Comprehension", semester: "Spring", year: 2025 },
      { code: "WRITE103", title: "Academic Writing", semester: "Fall", year: 2025 },
  
      // ✅ New Courses
      { code: "CSC210", title: "Discrete Mathematics", semester: "Fall", year: 2025 },
      { code: "CSC220", title: "Algorithms", semester: "Spring", year: 2025 },
      { code: "CSC240", title: "Software Engineering", semester: "Fall", year: 2025 },
      { code: "CSC250", title: "Computer Networks", semester: "Spring", year: 2025 },
      { code: "CSC260", title: "Web Development", semester: "Fall", year: 2025 },
      { code: "CSC270", title: "Object-Oriented Programming", semester: "Spring", year: 2025 },
      { code: "CSC300", title: "Database Systems", semester: "Fall", year: 2025 },
      { code: "CSC310", title: "Machine Learning", semester: "Spring", year: 2025 },
      { code: "CSC320", title: "Artificial Intelligence", semester: "Fall", year: 2025 },
      { code: "CSC350", title: "Cybersecurity", semester: "Spring", year: 2025 },
  
      { code: "BUS110", title: "Introduction to Business", semester: "Fall", year: 2025 },
      { code: "BUS210", title: "Marketing Principles", semester: "Spring", year: 2025 },
      { code: "HIS130", title: "World History", semester: "Fall", year: 2025 }
    ],
  });
  console.log("✅ Courses seeded");
  

  // Students + Grades
  await prisma.grade.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.student.deleteMany();

  const csvPath = path.join(process.cwd(), "data", "StudentsPerformance.csv");
  const students = await readCSV(csvPath);

  for (let i = 0; i < Math.min(students.length, 25); i++) {
    const s = students[i];
    const student = await prisma.student.create({
      data: {
        firstName: s.gender === "female" ? "Jane" : "John",
        lastName: s["race/ethnicity"] || "Unknown",
        email: `student${i}@smartedu.ac.uk`,
        studentNumber: `STD${1000 + i}`,
      },
    });

    const courseCode = ["MATH101", "READ102", "WRITE103"][i % 3];
    const course = await prisma.course.findUnique({ where: { code: courseCode } });

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: student.id,
        courseId: course.id,
        year: 2025,
        status: "active",
      },
    });

    await prisma.grade.create({
      data: {
        enrollmentId: enrollment.id,
        studentId: student.id,
        courseId: course.id,
        assessment: "Final Exam",
        score: Number(s["math score"] || 0),
      },
    });
  }
  console.log("✅ Students & grades seeded");

  // ✅ Documents (Parse PDFs)
  console.log("🗑️ Clearing old documents...");
  await prisma.document.deleteMany();

  const pdfFolder = path.join(process.cwd(), "data", "pdfs");
  if (fs.existsSync(pdfFolder)) {
    const parsedDocs = await parsePDFs(pdfFolder);
    for (const doc of parsedDocs) {
      await prisma.document.create({
        data: { ...doc, uploadedById: admin.id },
      });
    }
    console.log(`✅ Parsed and saved ${parsedDocs.length} PDF documents`);
  } else {
    console.log("⚠️ PDF folder missing. Skipping document seeding.");
  }

  console.log("\n✅ Seeding complete ✅");
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });