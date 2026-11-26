import type { Activity, Project } from "@/types";

// DATA DEMO: bukan data nyata.
export const demoProjects: Project[] = [
  { id: "p1", slug: "demo-servqual", title: "Kualitas Layanan Akademik (Demo)", description: "Contoh proyek validasi instrumen layanan akademik.", status: "active", questionnaireStatus: "published", respondentCount: 128, createdAt: "2026-09-12T08:00:00Z" },
  { id: "p2", slug: "demo-motivasi", title: "Motivasi Belajar Siswa (Demo)", description: "Contoh proyek survei motivasi belajar.", status: "active", questionnaireStatus: "draft", respondentCount: 0, createdAt: "2026-10-20T08:00:00Z" },
  { id: "p3", slug: "demo-kepuasan", title: "Kepuasan Pengguna Aplikasi (Demo)", description: "Contoh proyek yang sudah selesai.", status: "completed", questionnaireStatus: "closed", respondentCount: 212, createdAt: "2026-06-03T08:00:00Z" },
  { id: "p4", slug: "demo-baru", title: "Ide Penelitian Baru (Demo)", description: "Contoh proyek yang masih draf.", status: "draft", questionnaireStatus: "none", respondentCount: 0, createdAt: "2026-11-15T08:00:00Z" },
];

export const demoActivities: Activity[] = [
  { id: "a1", kind: "response", text: "3 responden baru menyelesaikan kuesioner (Demo)", at: "2026-11-25T10:30:00Z" },
  { id: "a2", kind: "publish", text: "Kuesioner layanan akademik dipublikasikan (Demo)", at: "2026-11-22T09:00:00Z" },
  { id: "a3", kind: "project", text: "Proyek baru dibuat (Demo)", at: "2026-11-15T08:00:00Z" },
];
