import fs from "fs";
import https from "https";

const files = [
  { name: "CSC101_Introduction_to_Programming_Lecture12.pdf", url: "https://scert.telangana.gov.in/pdf/publication/ebooks2019/8%20maths%20em%202020-21.pdf"}
//   { name: "CSC101_Assignment_1.pdf", url: "https://filesamples.com/samples/document/pdf/sample2.pdf"},
//   { name: "CSC202_Computer_Architecture_Lecture2.pdf", url: "https://filesamples.com/samples/document/pdf/sample3.pdf"},
//   { name: "CSC205_Data_Structures_Assignment.pdf", url: "https://filesamples.com/samples/document/pdf/sample4.pdf"},
//   { name: "CSC210_Discrete_Mathematics_Notes.pdf", url: "https://filesamples.com/samples/document/pdf/sample5.pdf"},
//   { name: "CSC220_Algorithms_Tutorial.pdf", url: "https://filesamples.com/samples/document/pdf/sample6.pdf"},
//   { name: "CSC230_Operating_Systems_Lecture3.pdf", url: "https://filesamples.com/samples/document/pdf/sample7.pdf"},
//   { name: "CSC240_Software_Engineering_Report.pdf", url: "https://filesamples.com/samples/document/pdf/sample8.pdf"},
//   { name: "CSC250_Computer_Networks_Lab_Notes.pdf", url: "https://filesamples.com/samples/document/pdf/sample9.pdf"},
//   { name: "CSC260_Web_Development_Assignment2.pdf", url: "https://filesamples.com/samples/document/pdf/sample10.pdf"},
//   { name: "CSC270_Object_Oriented_Programming_Notes.pdf", url: "https://filesamples.com/samples/document/pdf/sample11.pdf"},
//   { name: "CSC300_Database_Systems_Project.pdf", url: "https://filesamples.com/samples/document/pdf/sample12.pdf"},
//   { name: "CSC310_Machine_Learning_Report.pdf", url: "https://filesamples.com/samples/document/pdf/sample13.pdf"},
//   { name: "CSC320_Artificial_Intelligence_Essay.pdf", url: "https://filesamples.com/samples/document/pdf/sample14.pdf"},
//   { name: "CSC350_Cybersecurity_Research_Summary.pdf", url: "https://filesamples.com/samples/document/pdf/sample15.pdf"}
];

if (!fs.existsSync("pdfs")) fs.mkdirSync("pdfs");

files.forEach(file => {
  const filePath = `pdfs/${file.name}`;
  const fileStream = fs.createWriteStream(filePath);

  https.get(file.url, response => {
    response.pipe(fileStream);
    fileStream.on("finish", () => {
      fileStream.close();
      console.log(`✅ Downloaded: ${file.name}`);
    });
  });
});
