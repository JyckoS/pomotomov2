"use client";

import type { Area } from "react-easy-crop";

const MAX_AVATAR_BYTES = 100 * 1024;
const MAX_OUTPUT_SIZE = 256;
const MIN_OUTPUT_SIZE = 64;
const QUALITY_STEPS = [0.9, 0.82, 0.74, 0.66, 0.58, 0.5, 0.42, 0.34, 0.26];

async function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load selected image."));
    image.src = source;
  });
}

async function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
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
      quality,
    );
  });
}

function renderCroppedAvatar({
  image,
  cropAreaPixels,
  outputSize,
}: {
  image: HTMLImageElement;
  cropAreaPixels: Area;
  outputSize: number;
}): HTMLCanvasElement {
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

  return canvas;
}

export async function createCroppedAvatarBlob({
  imageSource,
  cropAreaPixels,
  outputSize = MAX_OUTPUT_SIZE,
  maxBytes = MAX_AVATAR_BYTES,
}: {
  imageSource: string;
  cropAreaPixels: Area;
  outputSize?: number;
  maxBytes?: number;
}): Promise<Blob> {
  const image = await loadImage(imageSource);

  for (
    let currentOutputSize = Math.min(outputSize, MAX_OUTPUT_SIZE);
    currentOutputSize >= MIN_OUTPUT_SIZE;
    currentOutputSize = Math.max(MIN_OUTPUT_SIZE, Math.floor(currentOutputSize * 0.8))
  ) {
    const canvas = renderCroppedAvatar({
      image,
      cropAreaPixels,
      outputSize: currentOutputSize,
    });

    for (const quality of QUALITY_STEPS) {
      const blob = await canvasToBlob(canvas, quality);
      if (blob.size <= maxBytes) {
        return blob;
      }
    }
  }

  throw new Error("Could not compress avatar under 100KB. Please choose a different image.");
}
