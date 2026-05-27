"use client";

import {
  useCallback,
  useState,
} from "react";

import Cropper from "react-easy-crop";

import imageCompression from "browser-image-compression";

import { supabase } from "@/lib/supabase";

import toast from "react-hot-toast";

function createImage(
  url: string
): Promise<HTMLImageElement> {
  return new Promise(
    (resolve, reject) => {
      const image =
        new Image();

      // FIXES TAINTED CANVAS
      image.crossOrigin =
        "anonymous";

      image.addEventListener(
        "load",
        () => resolve(image)
      );

      image.addEventListener(
        "error",
        (error) =>
          reject(error)
      );

      image.src = url;
    }
  );
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: any
) {
  const image =
    await createImage(imageSrc);

  const canvas =
    document.createElement(
      "canvas"
    );

  const ctx =
    canvas.getContext("2d");

  canvas.width =
    pixelCrop.width;

  canvas.height =
    pixelCrop.height;

  ctx?.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise<Blob | null>(
    (resolve) => {
      canvas.toBlob(
        (blob) =>
          resolve(blob),
        "image/jpeg"
      );
    }
  );
}

export default function AvatarUploader({
  user,
  onUpload,
}: {
  user: any;

  onUpload: (
    url: string
  ) => void;
}) {
  const [imageSrc, setImageSrc] =
    useState("");

    const [originalImage, setOriginalImage] =
  useState("");

  const [crop, setCrop] =
    useState({
      x: 0,
      y: 0,
    });

  const [zoom, setZoom] =
    useState(1);

  const [
    croppedAreaPixels,
    setCroppedAreaPixels,
  ] = useState<any>(null);

  const [uploading, setUploading] =
    useState(false);

  const onCropComplete =
    useCallback(
      (
        _: any,
        croppedAreaPixels: any
      ) => {
        setCroppedAreaPixels(
          croppedAreaPixels
        );
      },
      []
    );

  async function onFileChange(
    e: any
  ) {
    const file =
      e.target.files?.[0];

    if (!file) return;

    const compressed =
      await imageCompression(
        file,
        {
          maxSizeMB: 1,
          maxWidthOrHeight: 1200,
        }
      );

    const reader =
      new FileReader();

    reader.onload = () => {
      const result =
  reader.result as string;

setImageSrc(result);

setOriginalImage(result);
    };

    reader.readAsDataURL(
      compressed
    );
  }

  async function uploadAvatar() {
    if (
      !imageSrc ||
      !croppedAreaPixels
    )
      return;

    setUploading(true);

    try {
      const croppedBlob =
        await getCroppedImg(
          imageSrc,
          croppedAreaPixels
        );

      if (!croppedBlob)
        return;

      const croppedFileName =
  `${user.id}.jpg`;

const originalFileName =
  `original-${user.id}.jpg`;

      // SAVE ORIGINAL IMAGE
await supabase.storage
  .from("avatars")
  .upload(
    originalFileName,
    await (
      await fetch(
        originalImage
      )
    ).blob(),
    {
      upsert: true,
    }
  );

// SAVE ORIGINAL IMAGE
await supabase.storage
  .from("avatars")
  .upload(
    originalFileName,
    await (
      await fetch(
        originalImage
      )
    ).blob(),
    {
      upsert: true,
    }
  );

// SAVE CROPPED IMAGE
const { error } =
  await supabase.storage
    .from("avatars")
    .upload(
      croppedFileName,
      croppedBlob,
      {
        upsert: true,
      }
    );


      if (error) {
        console.error(error);

        toast.error(
          "Upload failed"
        );

        setUploading(false);

        return;
      }

      const { data } =
        supabase.storage
          .from("avatars")
          .getPublicUrl(
  croppedFileName
);

      const avatarUrl =
        `${data.publicUrl}?t=${Date.now()}`;

      await supabase.auth.updateUser({
  data: {
    avatar_url:
      avatarUrl,

  },
});

      toast.success(
        "Avatar updated!"
      );

      onUpload(avatarUrl);

      setImageSrc("");

      setUploading(false);
    } catch (err) {
      console.error(err);

      toast.error(
        "Something went wrong"
      );

      setUploading(false);
    }
  }

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <label className="cursor-pointer bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 px-6 py-3 rounded-2xl font-bold transition shadow-lg">
          Upload New Avatar

          <input
            type="file"
            accept="image/*"
            onChange={
              onFileChange
            }
            className="hidden"
          />
        </label>

        {user.user_metadata
          ?.avatar_url && (
          <button
            onClick={async () => {

  setCrop({
    x: 0,
    y: 0,
  });

  setZoom(1);

  const { data } =
    supabase.storage
      .from("avatars")
      .getPublicUrl(
        `original-${user.id}.jpg`
      );

  setImageSrc(
    `${data.publicUrl}?t=${Date.now()}`
  );
}}
            className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-2xl font-bold transition"
          >
            Edit Current Avatar
          </button>
        )}
      </div>

      {/* Cropper Modal */}
      {imageSrc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-[32px] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-800">
              <div>
                <h2 className="text-3xl font-black text-white">
                  Edit Avatar
                </h2>

                <p className="text-zinc-400 mt-1">
                  Move and zoom your
                  image
                </p>
              </div>

              <button
                onClick={() =>
                  setImageSrc("")
                }
                className="w-12 h-12 rounded-2xl bg-zinc-900 hover:bg-zinc-800 transition text-2xl"
              >
                ×
              </button>
            </div>

            {/* Crop Area */}
            <div className="relative h-[500px] bg-black">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={
                  setCrop
                }
                onZoomChange={
                  setZoom
                }
                onCropComplete={
                  onCropComplete
                }
              />
            </div>

            {/* Controls */}
            <div className="p-8">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-zinc-300 font-semibold">
                    Zoom
                  </p>

                  <p className="text-zinc-500">
                    {zoom.toFixed(1)}x
                  </p>
                </div>

                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) =>
                    setZoom(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  className="w-full accent-violet-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={
                    uploadAvatar
                  }
                  disabled={
                    uploading
                  }
                  className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 px-6 py-4 rounded-2xl font-bold transition"
                >
                  {uploading
                    ? "Saving..."
                    : "Save Avatar"}
                </button>

                <button
                  onClick={() =>
                    setImageSrc("")
                  }
                  className="flex-1 bg-zinc-900 hover:bg-zinc-800 px-6 py-4 rounded-2xl font-bold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}