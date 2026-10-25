"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { ASSETS } from "@/constants/assets";
import { cn } from "@/lib/utils/cn";
import {
  detectMediaKind,
  driveEmbedUrl,
  videoPosterUrl,
  youtubeEmbedUrl,
} from "@/lib/utils/media";

export function ProductMediaGallery({
  image,
  images,
  videos,
  alt,
}: {
  image: string;
  images: string[];
  videos: string[];
  alt: string;
}) {
  const thumbs = [...new Set([image, ...images, ...videos].filter(Boolean))];
  const [active, setActive] = useState(image);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setActive(image);
    setFailed(false);
  }, [image]);
  const current = active || image;
  const kind = videos.includes(current) ? detectMediaKind(current) : "file";
  const isVideo = videos.includes(current);

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-card lg:rounded-xl lg:border-0 lg:bg-cream-dark">
        {isVideo ? (
          <VideoFrame url={current} kind={kind} title={alt} />
        ) : (
          <>
            <Image
              src={failed ? ASSETS.PLACEHOLDER_PRODUCT : current}
              alt={alt}
              fill
              unoptimized
              priority
              onError={() => setFailed(true)}
              className="object-contain p-3 lg:object-cover lg:p-0"
            />
            {videos.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setFailed(false);
                  setActive(videos[0]);
                }}
                className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-dark/85 px-3.5 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-sm transition-all hover:bg-primary hover:scale-105 active:scale-95"
              >
                <Play className="h-3.5 w-3.5 fill-white text-white" />
                Watch Video
              </button>
            ) : null}
          </>
        )}
      </div>
      {thumbs.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {thumbs.map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => {
                setFailed(false);
                setActive(src);
              }}
              className={cn(
                "relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border lg:h-16 lg:w-16 lg:rounded-md",
                src === current ? "border-primary ring-2 ring-primary/30" : "border-border",
              )}
            >
              {videos.includes(src) ? (
                <div className="relative h-full w-full">
                  <VideoThumb url={src} />
                  <span className="absolute bottom-0 left-0 right-0 bg-primary/95 py-0.5 text-center text-[9px] font-bold uppercase tracking-wider text-white">
                    Video
                  </span>
                </div>
              ) : (
                <Image src={src} alt="" fill unoptimized className="object-cover" />
              )}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function VideoThumb({ url }: { url: string }) {
  const poster = videoPosterUrl(url);
  const kind = detectMediaKind(url);
  const [posterFailed, setPosterFailed] = useState(false);
  const showPoster = Boolean(poster) && !posterFailed;

  return (
    <span className="relative block h-full w-full bg-dark">
      {showPoster ? (
        <Image
          src={poster ?? ""}
          alt=""
          fill
          unoptimized
          className="object-cover"
          onError={() => setPosterFailed(true)}
        />
      ) : kind === "file" ? (
        <video
          src={`${url}#t=0.1`}
          muted
          playsInline
          preload="metadata"
          className="pointer-events-none h-full w-full object-cover"
        />
      ) : null}
      <span className="absolute inset-0 flex items-center justify-center bg-dark/30">
        <Play className="h-4 w-4 fill-white text-white" />
      </span>
    </span>
  );
}

function VideoFrame({
  url,
  kind,
  title,
}: {
  url: string;
  kind: ReturnType<typeof detectMediaKind>;
  title: string;
}) {
  if (kind === "file") {
    return (
      <video
        src={url}
        controls
        autoPlay
        playsInline
        className="h-full w-full object-contain"
      />
    );
  }
  const embed =
    kind === "youtube"
      ? youtubeEmbedUrl(url) ?? url
      : kind === "drive"
        ? driveEmbedUrl(url)
        : url;
  return (
    <iframe
      src={embed}
      title={title}
      className="h-full w-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}
