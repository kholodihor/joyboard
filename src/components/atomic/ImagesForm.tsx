"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Check } from "lucide-react";
import { defaultImages } from "@/constants/images";
import type { TImage } from "@/types";

const ImagesForm = ({ name }: { name: string }) => {
  const [imageId, setImageId] = useState("");
  return (
    <div className="relative">
      <div className="mb-2 grid grid-cols-3 gap-2">
        {defaultImages?.map((image: TImage) => (
          <div
            className={
              "group relative aspect-video cursor-pointer bg-muted transition hover:opacity-75"
            }
            onClick={() => setImageId(image.id)}
            key={image.id}
          >
            <input
              type="radio"
              id={name}
              name={name}
              checked={imageId == image.id}
              value={image.image}
              className="hidden"
            />
            <Image
              src={image.image}
              alt={image.name}
              className="rounded-sm object-cover"
              fill
            />
            {imageId == image.id && (
              <div className="absolute inset-y-0 flex h-full w-full items-center justify-center bg-black/40">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
            <span className="absolute bottom-0 w-full truncate bg-black/50 p-0.5 text-[10px] text-white opacity-0 group-hover:opacity-100">
              {image.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagesForm;
