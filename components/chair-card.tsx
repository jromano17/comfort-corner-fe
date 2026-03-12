"use client";

import Image from "next/image";
import Link from "next/link";
import { Chair } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface ChairCardProps {
  chair: Chair;
}

export function ChairCard({ chair }: ChairCardProps) {
  console.log(chair.galleryImageUrls);
  const thumbnailImage = chair.galleryImageUrls?.[0] || "/placeholder-chair.jpg";

  return (
    <Link href={`/chairs/${chair.id}`} className="group block">
      <article className="overflow-hidden rounded-lg border bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/20">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={thumbnailImage}
            alt={chair.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <div className="flex flex-col gap-2 p-4">
          <Badge variant="secondary" className="w-fit text-xs">
            {chair.category.name}
          </Badge>
          <h3 className="font-serif text-lg font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {chair.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {chair.description}
          </p>
          <p className="font-serif text-lg font-semibold text-primary">
            From ${chair.basePrice.toLocaleString()}
          </p>
        </div>
      </article>
    </Link>
  );
}
