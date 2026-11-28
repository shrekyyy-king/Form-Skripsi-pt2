import { brand } from "@/config/brand";

export function BrandMark() {
  return (
    <div className="flex min-w-0 items-center gap-2 font-semibold">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {brand.logoPath ? <img src={brand.logoPath} alt="" className="h-7 w-7 shrink-0" /> : (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-xs text-primary-foreground">{brand.shortName}</span>
      )}
      <span className="truncate">{brand.name}</span>
    </div>
  );
}
