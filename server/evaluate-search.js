// evaluate-search.js
// evaluate-search.js
import fs from "fs";
import { performance } from "perf_hooks"; // Node native timing
// ✅ Using built-in fetch (Node 18+)


const API_URL = "http://localhost:5000/api/search";

// Load ground truth
const groundTruth = JSON.parse(fs.readFileSync("./ground-truth.json", "utf8"));

const searchModes = ["exact", "fuzzy", "all"]; // evaluation modes

// Utility: compute precision, recall, f1
function computeMetrics(relevant, returned) {
  const relevantSet = new Set(relevant.map((x) => `${x.type}-${x.id}`));
  const returnedSet = new Set(returned.map((x) => `${x.type}-${x.id}`));

  const TP = [...returnedSet].filter((x) => relevantSet.has(x)).length;
  const FP = [...returnedSet].filter((x) => !relevantSet.has(x)).length;
  const FN = [...relevantSet].filter((x) => !returnedSet.has(x)).length;

  const precision = TP + FP === 0 ? 0 : TP / (TP + FP);
  const recall = TP + FN === 0 ? 0 : TP / (TP + FN);
  const f1 =
    precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);

  return { TP, FP, FN, precision, recall, f1 };
}

// evaluate one query in one mode
async function testQuery(query, mode) {
  const start = performance.now();
  const res = await fetch(`${API_URL}?q=${encodeURIComponent(query)}&mode=${mode}`);
  const json = await res.json();
  const timeMs = performance.now() - start;

  const returnedItems = [
    ...json.data.students.map((s) => ({ type: "student", id: s.id })),
    ...json.data.courses.map((c) => ({ type: "course", id: c.id })),
    ...json.data.documents.map((d) => ({ type: "document", id: d.id })),
  ];

  const truth = groundTruth.queries.find((q) => q.query.toLowerCase() === query.toLowerCase());
  const metrics = computeMetrics(truth?.relevant || [], returnedItems);

  return {
    query,
    mode,
    ...metrics,
    time: timeMs.toFixed(2),
  };
}

// Main evaluation runner
async function runEvaluation() {
  const results = [];

  for (const q of groundTruth.queries) {
    for (const mode of searchModes) {
      const r = await testQuery(q.query, mode);
      results.push(r);
      console.log(
        `${q.query.padEnd(12)} | ${mode.padEnd(6)} | P=${r.precision.toFixed(
          2
        )} R=${r.recall.toFixed(2)} F1=${r.f1.toFixed(2)} | ${r.time}ms`
      );
    }
  }

  // Save CSV
  const csvRows = [
    "query,mode,TP,FP,FN,precision,recall,F1,timeMs",
    ...results.map(
      (r) =>
        `${r.query},${r.mode},${r.TP},${r.FP},${r.FN},${r.precision.toFixed(
          3
        )},${r.recall.toFixed(3)},${r.f1.toFixed(3)},${r.time}`
    ),
  ].join("\n");

  fs.writeFileSync("evaluation-results.csv", csvRows);
  console.log("\n✅ Saved results to evaluation-results.csv");

  console.log("\n✅ Evaluation Complete");
}

runEvaluation();
