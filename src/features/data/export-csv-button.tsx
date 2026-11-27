"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toCsv } from "./dataset";

interface Props { header: string[]; rows: (string | number)[][]; fileName: string; label: string }

export function ExportCsvButton({ header, rows, fileName, label }: Props) {
  const download = () => {
    // BOM agar Excel membaca UTF-8 dengan benar.
    const blob = new Blob(["\uFEFF" + toCsv(header, rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };
  return <Button variant="outline" onClick={download}><Download className="h-4 w-4" aria-hidden />{label}</Button>;
}
