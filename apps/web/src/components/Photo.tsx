import Image from "next/image";
import clsx from "clsx";
import type { Photo as P } from "@/content/site";

export function Photo({ photo, className, priority, sizes = "(min-width: 1024px) 50vw, 100vw", position }: {
  photo: P; className?: string; priority?: boolean; sizes?: string; position?: string;
}) {
  return (
    <div className={clsx("relative overflow-hidden bg-forest-50", className)}>
      <Image src={photo.src} alt={photo.alt} fill priority={priority} sizes={sizes} className="object-cover" style={position ? { objectPosition: position } : undefined} />
    </div>
  );
}
