"use client";

import type { Area } from "react-easy-crop";

async function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load selected image."));
    image.src = source;
  });
}

export async function createCroppedAvatarBlob({
  imageSource,
  cropAreaPixels,
  outputSize = 256,
}: {
  imageSource: string;
  cropAreaPixels: Area;
  outputSize?: number;
}): Promise<Blob> {
  const image = await loadImage(imageSource);
  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not create image canvas.");
  }

  const sourceX = Math.max(0, cropAreaPixels.x);
  const sourceY = Math.max(0, cropAreaPixels.y);
  const sourceWidth = Math.max(1, cropAreaPixels.width);
  const sourceHeight = Math.max(1, cropAreaPixels.height);

  context.clearRect(0, 0, outputSize, outputSize);
  context.beginPath();
  context.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
  context.closePath();
  context.clip();

  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    outputSize,
    outputSize,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to prepare avatar image."));
          return;
        }

        resolve(blob);
      },
      "image/webp",
      0.86,
    );
  });
}
