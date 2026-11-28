/*
 * Pemeriksaan logika murni (Akun-3, QA). BUKAN bagian build; tidak ada dependensi baru di package.json.
 * Cara menjalankan (di akar repo, butuh Node 20+):
 *   npm install --no-save tsx
 *   npx tsx docs/qa-scripts/qa-checks.ts
 * Skrip menyatakan perilaku YANG DIINGINKAN. Pada kode sebelum perbaikan, beberapa baris GAGAL (itu temuan di
 * docs/QA_REPORT.md); setelah docs/proposed-fixes diterapkan, yang tersisa hanya temuan yang belum diperbaiki.
 * Nilai alpha data demo (0.9510395707578807) sudah dicocokkan dengan hitungan independen di Python.
 */
import { scoreLikert } from "@/lib/scoring";
import { cronbachAlpha, mean, sampleVariance, standardDeviation } from "@/lib/stats";
import { buildDataset, toCsv } from "@/features/data/dataset";
import { demoQuestionnaires } from "@/lib/data/mock/fixtures-questionnaire";
import { demoResponses } from "@/lib/data/mock/fixtures-responses";
import { buildPages, getPageProgress, groupQuestions, orderQuestions, validateAnswer, validatePage, resolveNavigationMode } from "@/features/survey/section-utils";
import { addQuestionToSection, moveQuestionInGroup, moveQuestionToSection, removeSection, removeQuestion } from "@/features/builder/section-utils";
import { createLikertConfig, moveItem } from "@/features/builder/builder-utils";
import type { Question, Section, LikertConfig } from "@/types";

let pass = 0, fail = 0;
const ok = (name: string, cond: boolean, extra = "") => { cond ? pass++ : fail++; console.log(`${cond ? "LOLOS" : "GAGAL"}  ${name}${extra ? "  -> " + extra : ""}`); };
const near = (a: number | null, b: number, e = 1e-9) => a !== null && Math.abs(a - b) < e;

// --- scoring
const cfg5: LikertConfig = demoQuestionnaires[0]!.questions[0]!.likert!;
ok("scoring: tanpa reverse", scoreLikert(4, cfg5) === 4);
ok("scoring: reverse 5-poin (4 -> 2)", scoreLikert(4, { ...cfg5, reverseScored: true }) === 2);
const cfg07: LikertConfig = { points: 3, direction: "ascending", reverseScored: true, options: [{ value: 0, label: "a" }, { value: 1, label: "b" }, { value: 2, label: "c" }] };
ok("scoring: reverse skala 0-2 (0 -> 2)", scoreLikert(0, cfg07) === 2);
const empty: LikertConfig = { points: 0, direction: "ascending", reverseScored: true, options: [] };
ok("scoring: reverse opsi kosong tidak NaN (Math.max([]) = -Infinity)", Number.isFinite(scoreLikert(3, empty)), String(scoreLikert(3, empty)));

// --- stats
ok("stats: mean kosong = NaN", Number.isNaN(mean([])));
ok("stats: varians n=1 = NaN", Number.isNaN(sampleVariance([5])));
ok("stats: SD [2,4,4,4,5,5,7,9] sampel", near(standardDeviation([2, 4, 4, 4, 5, 5, 7, 9]), 2.138089935299395, 1e-9));
ok("alpha: n<2 null", cronbachAlpha([[1, 2, 3]]) === null);
ok("alpha: k<2 null", cronbachAlpha([[1], [2]]) === null);
ok("alpha: varians total 0 null", cronbachAlpha([[3, 3], [3, 3]]) === null);
ok("alpha: baris tak sama panjang null", cronbachAlpha([[1, 2], [3]]) === null);
// data demo, reverse diterapkan pada s3
const q = demoQuestionnaires[0]!;
const likertQs = q.questions.filter((x) => x.type === "likert");
const matrix = demoResponses.map((r) => likertQs.map((x) => scoreLikert(Number(r.answers[x.id]), x.likert!)));
const alpha = cronbachAlpha(matrix);
console.log("INFO  alpha data demo (TS) =", alpha, " matriks:", JSON.stringify(matrix));

// --- dataset / CSV
const ds = buildDataset(q, demoResponses, true);
ok("dataset: jumlah kolom = jumlah soal + ID", ds.header.length === q.questions.length + 1);
ok("dataset: reverse diterapkan (R1 s3: 2 -> 4)", ds.rows[0]![3] === 4, String(ds.rows[0]![3]));
const raw = buildDataset(q, demoResponses, false);
ok("dataset: tanpa scoring nilai mentah (R1 s3 = 2)", raw.rows[0]![3] === 2);
ok("csv: koma dan kutip di-escape", toCsv(["a"], [['x,"y"']]) === 'a\r\n"x,""y"""');
ok("csv: baris baru di-escape", toCsv(["a"], [["x\ny"]]).includes('"x\ny"'));
ok("csv: CR tunggal di-escape (\\r)", toCsv(["a"], [["x\ry"]]).includes('"x\ry"'), JSON.stringify(toCsv(["a"], [["x\ry"]])));
ok("csv: formula '=1+1' dinetralkan (CSV injection)", !toCsv(["a"], [["=HYPERLINK(\"http://x\",\"klik\")"]]).split("\r\n")[1]!.startsWith("=") && !toCsv(["a"], [["=1+1"]]).split("\r\n")[1]!.startsWith("="), JSON.stringify(toCsv(["a"], [["=1+1"]])));
ok("csv: '@SUM(1)' dinetralkan", !toCsv(["a"], [["@SUM(1)"]]).split("\r\n")[1]!.startsWith("@"));
// Likert opsional dengan jawaban "" (dilewati)
const likertEmpty = buildDataset(q, [{ id: "x", questionnaireSlug: q.slug, submittedAt: "2026-01-01T00:00:00Z", answers: { s1: "" } }], true);
ok("dataset: jawaban Likert '' (dilewati) tidak menjadi 0/skor", likertEmpty.rows[0]![1] === "", String(likertEmpty.rows[0]![1]));

// --- survey section-utils
const mkq = (id: string, sectionId?: string, extra: Partial<Question> = {}): Question => ({ id, type: "shortAnswer", text: id, required: false, sectionId, ...extra });
const secs: Section[] = [{ id: "A", title: "A" }, { id: "B", title: "B" }];
const qs = [mkq("1", "B"), mkq("2", "A"), mkq("3"), mkq("4", "A"), mkq("5", "ghost")];
ok("order: seksi dulu lalu tanpa seksi; sectionId hantu = tanpa seksi", orderQuestions(qs, secs).map((x) => x.id).join() === "2,4,1,3,5", orderQuestions(qs, secs).map((x) => x.id).join());
ok("pages perSection: 3 layar (A,B,tanpa seksi)", buildPages(qs, secs, "perSection").length === 3);
ok("pages perQuestion: 5 layar", buildPages(qs, secs, "perQuestion").length === 5);
ok("mode perSection tanpa seksi -> perQuestion", resolveNavigationMode({ sections: [], navigationMode: "perSection" }) === "perQuestion");
ok("progress: indeks di luar rentang dijepit", getPageProgress(3, 99).current === 3 && getPageProgress(3, -5).current === 1 && getPageProgress(0, 0).total === 0);
ok("validasi: wajib kosong -> required", validateAnswer(mkq("w", undefined, { required: true }), "") === "required");
ok("validasi: wajib hanya spasi ditolak", validateAnswer(mkq("w", undefined, { required: true }), "   ") === "required", String(validateAnswer(mkq("w", undefined, { required: true }), "   ")));
ok("validasi: checkbox wajib array kosong -> required", validateAnswer(mkq("c", undefined, { required: true, type: "checkbox" }), []) === "required");
ok("validasi: angka tidak valid", validateAnswer(mkq("n", undefined, { type: "numeric" }), "abc") === "invalidNumber");
ok("validasi: angka opsional kosong valid", validateAnswer(mkq("n", undefined, { type: "numeric" }), "") === null);
ok("validasi: angka '1e999' (Infinity) ditolak", validateAnswer(mkq("n", undefined, { type: "numeric" }), "1e999") === "invalidNumber", String(validateAnswer(mkq("n", undefined, { type: "numeric" }), "1e999")));
ok("validatePage: hanya soal bermasalah", Object.keys(validatePage([mkq("a", undefined, { required: true }), mkq("b")], {})).join() === "a");

// --- builder section-utils
const r1 = removeSection(qs, secs, "A");
ok("removeSection: soal A pindah ke tanpa seksi & urutan stabil", r1.questions.map((x) => x.id).join() === "1,2,4,3,5", r1.questions.map((x) => x.id).join());
ok("removeSection: tidak ada sectionId yang merujuk A", r1.questions.every((x) => x.sectionId !== "A"));
ok("removeSection: tidak mengubah argumen asli", secs.length === 2 && qs[1]!.sectionId === "A");
const mv = moveQuestionInGroup(qs, secs, "4", -1).map((x) => x.id).join();
ok("moveQuestionInGroup: 4 naik melewati 2 di seksi A", mv === "4,2,1,3,5", mv);
ok("moveQuestionInGroup: tidak melompati batas seksi", moveQuestionInGroup(qs, secs, "2", -1).map((x) => x.id).join() === "2,4,1,3,5");
const toB = moveQuestionToSection(qs, secs, "3", "B").map((x) => `${x.id}:${x.sectionId ?? "-"}`).join();
ok("moveQuestionToSection: 3 -> akhir seksi B", toB.includes("1:B,3:B") , toB);
const added = addQuestionToSection(qs, secs, mkq("new"), "A").map((x) => x.id).join();
ok("addQuestionToSection: di akhir seksi A", added === "2,4,new,1,3,5", added);
ok("removeQuestion", removeQuestion(qs, secs, "1").length === 4);
ok("moveItem batas", moveItem([1, 2, 3], 0, -1).join() === "1,2,3" && moveItem([1, 2, 3], 2, 1).join() === "1,2,3");
// Likert config
const l3 = createLikertConfig(3);
const l5from3 = createLikertConfig(5, l3);
ok("createLikertConfig: 2-10 dijepit", createLikertConfig(99).points === 10 && createLikertConfig(0).points === 2);
ok("createLikertConfig: 3->5 label seragam (bukan campuran '1,2,3,Setuju,Sangat setuju')", new Set(l5from3.options.map((o) => /^\d+$/.test(o.label))).size === 1, l5from3.options.map((o) => o.label).join(" | "));
ok("createLikertConfig: nilai opsi unik", new Set(createLikertConfig(7).options.map((o) => o.value)).size === 7);
console.log(`\nRINGKASAN: ${pass} lolos, ${fail} gagal`);
