import { brand } from "@/config/brand";

export function BrandMark() {
  return (
    <div className="flex items-center gap-2 font-semibold">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {brand.logoPath ? <img src={brand.logoPath} alt="" className="h-7 w-7" /> : (
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs text-primary-foreground">{brand.shortName}</span>
      )}
      <span>{brand.name}</span>
    </div>
  );
}
