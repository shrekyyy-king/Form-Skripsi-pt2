export function DataTable({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted text-left">
          <tr>{head.map((h, i) => <th key={i} scope="col" className="whitespace-nowrap px-3 py-2 font-medium">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t">{row.map((cell, j) => <td key={j} className="whitespace-nowrap px-3 py-2">{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function QuestionLegend({ columns }: { columns: { label: string; text: string }[] }) {
  return (
    <ul className="space-y-1 text-xs text-muted-foreground">
      {columns.map((c) => <li key={c.label}><span className="font-medium">{c.label}</span>: {c.text}</li>)}
    </ul>
  );
}
