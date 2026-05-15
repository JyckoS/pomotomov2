"use client";

import { type ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { Camera, Image as ImageIcon, RefreshCcw, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import "react-easy-crop/react-easy-crop.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCroppedAvatarBlob } from "@/lib/avatar/crop-image";

const SUPPORTED_FILE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_BYTES = 5 * 1024 * 1024;

function stopMediaStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

export function AvatarEditor({ initialImageUrl }: { initialImageUrl?: string | null }) {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropAreaPixels, setCropAreaPixels] = useState<Area | null>(null);
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(initialImageUrl ?? null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetCropState = useCallback(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropAreaPixels(null);
  }, []);

  const openCamera = useCallback(async () => {
    setErrorMessage(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = mediaStream;
      setIsCameraOpen(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch {
      setErrorMessage("Could not access camera. Please allow permission or upload an image.");
    }
  }, []);

  const closeCamera = useCallback(() => {
    stopMediaStream(streamRef.current);
    streamRef.current = null;
    setIsCameraOpen(false);
  }, []);

  useEffect(() => {
    return () => {
      closeCamera();
    };
  }, [closeCamera]);

  useEffect(() => {
    if (!isCameraOpen || !videoRef.current || !streamRef.current) {
      return;
    }

    const videoElement = videoRef.current;
    videoElement.srcObject = streamRef.current;

    void videoElement.play().catch(() => {
      setErrorMessage("Camera started, but preview could not play.");
    });

    return () => {
      videoElement.srcObject = null;
    };
  }, [isCameraOpen]);

  useEffect(() => {
    if (!imageSource || !imageSource.startsWith("blob:")) {
      return;
    }

    return () => {
      URL.revokeObjectURL(imageSource);
    };
  }, [imageSource]);

  const onFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setErrorMessage(null);

      const selectedFile = event.target.files?.[0];
      if (!selectedFile) {
        return;
      }

      if (!SUPPORTED_FILE_TYPES.has(selectedFile.type)) {
        setErrorMessage("Please upload a JPG, PNG, or WEBP image.");
        return;
      }

      if (selectedFile.size > MAX_FILE_BYTES) {
        setErrorMessage("Please choose an image smaller than 5MB.");
        return;
      }

      closeCamera();
      resetCropState();
      setImageSource(URL.createObjectURL(selectedFile));
    },
    [closeCamera, resetCropState],
  );

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) {
      return;
    }

    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setErrorMessage("Camera is still loading. Please try capture again.");
      return;
    }

    const captureCanvas = document.createElement("canvas");
    captureCanvas.width = video.videoWidth;
    captureCanvas.height = video.videoHeight;

    const captureContext = captureCanvas.getContext("2d");
    if (!captureContext) {
      setErrorMessage("Could not capture image from camera.");
      return;
    }

    captureContext.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);
    const captureDataUrl = captureCanvas.toDataURL("image/jpeg", 0.92);

    closeCamera();
    resetCropState();
    setImageSource(captureDataUrl);
  }, [closeCamera, resetCropState]);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCropAreaPixels(croppedPixels);
  }, []);

  const saveAvatar = useCallback(async () => {
    if (!imageSource || !cropAreaPixels) {
      setErrorMessage("Please choose or capture a photo first.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const avatarBlob = await createCroppedAvatarBlob({
        imageSource,
        cropAreaPixels,
        outputSize: 256,
      });

      const payload = new FormData();
      payload.append("avatar", avatarBlob, "avatar.webp");

      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body: payload,
      });

      const responseData = (await response.json()) as { imageUrl?: string; error?: string };

      if (!response.ok || !responseData.imageUrl) {
        setIsSubmitting(false);
        setErrorMessage(responseData.error ?? "Unable to save avatar. Please try again.");
        return;
      }

      setAvatarPreviewUrl(responseData.imageUrl);
      setImageSource(null);
      setIsSubmitting(false);
      router.push("/dashboard");
      router.refresh();
    } catch {
      setIsSubmitting(false);
      setErrorMessage("Unable to save avatar. Please try again.");
    }
  }, [cropAreaPixels, imageSource, router]);

  return (
    <div className="w-full max-w-xl rounded-[16px] border border-[rgba(0,0,0,0.1)] bg-white p-6 shadow-[rgba(0,0,0,0.04)_0px_4px_18px,rgba(0,0,0,0.027)_0px_2.025px_7.84688px,rgba(0,0,0,0.02)_0px_0.8px_2.925px,rgba(0,0,0,0.01)_0px_0.175px_1.04062px] sm:p-7">
      <div className="mb-6 text-center">
        <h3 className="text-[26px] font-bold leading-[1.23] tracking-[-0.625px] text-[rgba(0,0,0,0.95)]">
          Choose your profile photo
        </h3>
        <p className="mt-1 text-sm text-[#615d59]">
          Upload or capture a photo, adjust the circle, then save.
        </p>
      </div>

      <div className="mb-5 flex justify-center">
        <div className="size-24 overflow-hidden rounded-full border border-[rgba(0,0,0,0.1)] bg-[#f6f5f4]">
          {avatarPreviewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarPreviewUrl}
              alt="Current avatar"
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-[#a39e98]">
              <ImageIcon className="size-5" />
            </div>
          )}
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
          <ImageIcon className="size-4" />
          Upload image
        </Button>

        <Button type="button" variant="outline" onClick={openCamera}>
          <Camera className="size-4" />
          Use camera
        </Button>

        <Input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={onFileChange}
        />
      </div>

      {isCameraOpen ? (
        <div className="mb-4 rounded-[12px] border border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] p-3">
          <video
            ref={videoRef}
            className="h-[280px] w-full rounded-[8px] bg-black object-cover"
            autoPlay
            muted
            playsInline
          />
          <div className="mt-3 flex gap-2">
            <Button type="button" onClick={capturePhoto}>
              <Camera className="size-4" />
              Capture photo
            </Button>
            <Button type="button" variant="ghost" onClick={closeCamera}>
              Close camera
            </Button>
          </div>
        </div>
      ) : null}

      {imageSource ? (
        <div className="mb-4">
          <div className="relative h-[320px] w-full overflow-hidden rounded-[12px] bg-[#111]">
            <Cropper
              image={imageSource}
              crop={crop}
              zoom={zoom}
              cropShape="round"
              showGrid={false}
              aspect={1}
              minZoom={1}
              maxZoom={3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="avatar-zoom" className="text-sm font-medium text-[rgba(0,0,0,0.95)]">
              Zoom
            </Label>
            <Input
              id="avatar-zoom"
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
            />
          </div>
        </div>
      ) : null}

      {errorMessage ? (
        <p className="mb-4 rounded-[4px] border border-[#dd5b00]/30 bg-[#ff64c8]/10 px-3 py-2 text-sm text-[#dd5b00]">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={saveAvatar}
          disabled={!imageSource || !cropAreaPixels || isSubmitting}
        >
          <Save className="size-4" />
          {isSubmitting ? "Saving..." : "Save avatar"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          disabled={!imageSource || isSubmitting}
          onClick={() => {
            setImageSource(null);
            resetCropState();
          }}
        >
          <RefreshCcw className="size-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
