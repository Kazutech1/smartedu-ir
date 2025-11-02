import fs from "fs";
import PDFDocument from "pdfkit";

const folder = "pdfs";

fs.readdirSync(folder).forEach(file => {
  if (file.endsWith(".pdf")) {
    const filePath = `${folder}/${file}`;
    const tempPath = `${folder}/temp_${file}`;

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(tempPath);
    doc.pipe(stream);

    // Add realistic academic text content
    doc.fontSize(14).text("SmartEdU Academic Document", { align: "center" });
    doc.moveDown();
    doc.fontSize(11).text(`File Name: ${file}`);
    doc.moveDown();
    doc.text(
      "This academic document is part of the SmartEdU learning archive. " +
      "It contains course-related educational content used for student learning and academic record management. " +
      "The document contains subject material, analysis, assignment responses or research findings relevant to higher education courses.\n\n"
    );

    doc.text(
      "Keywords: assignment, research, university, academic, lecture, programming, algorithm, machine learning, database, software engineering, artificial intelligence.\n\n"
    );

    doc.text(
      "This content supports information retrieval testing using keyword search, fuzzy matching, and ranked retrieval methods."
    );

    doc.end();

    stream.on("finish", () => {
      fs.renameSync(tempPath, filePath);
      console.log(`✅ Enhanced: ${file}`);
    });
  }
});
