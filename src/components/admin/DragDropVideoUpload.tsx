"use client";

import React, { useState, useRef } from "react";

interface DragDropVideoUploadProps {
  currentVideoUrl?: string;
  onVideoChange: (newUrl: string) => void;
  label?: string;
  posterUrl?: string;
}

const PRESET_BEDDING_VIDEOS = [
  {
    name: "Luxury White Linen Folds",
    url: "https://assets.mixkit.co/videos/preview/mixkit-folds-of-a-white-fabric-41007-large.mp4",
    description: "Serene, slow-motion billowing linen textile in soft morning daylight",
  },
  {
    name: "Pure Breeze Cotton Drape",
    url: "https://assets.mixkit.co/videos/preview/mixkit-white-curtain-blowing-in-the-wind-41589-large.mp4",
    description: "Gentle natural air currents through organic woven fabric",
  },
  {
    name: "Local Project File (/videos/hero-banner.mp4)",
    url: "/videos/hero-banner.mp4",
    description: "Points to public/videos/hero-banner.mp4 in your local project root",
  },
];

export function DragDropVideoUpload({
  currentVideoUrl = "",
  onVideoChange,
  label = "Hero Cinematic Video Asset (Slide 2)",
  posterUrl = "/images/hero-bedding.jpg",
}: DragDropVideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [uploadWarning, setUploadWarning] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    setUploadWarning(null);
    setVideoError(false);

    if (!file.type.startsWith("video/")) {
      alert("Please upload a valid video file (MP4, WebM, MOV).");
      return;
    }

    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 25) {
      alert(
        `File size is ${sizeInMB.toFixed(1)}MB. For website performance, please compress your banner video to under 10MB or upload it to a CDN/cloud storage.`
      );
      return;
    }

    if (sizeInMB > 10) {
      setUploadWarning(
        `Notice: Video is ${sizeInMB.toFixed(1)}MB. It will play fine, but compressing under 4MB is recommended for faster mobile loading.`
      );
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        onVideoChange(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      setVideoError(false);
      onVideoChange(customUrl.trim());
      setCustomUrl("");
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block font-label-md text-sm text-primary font-medium">{label}</label>
          <p className="font-body-sm text-xs text-on-surface-variant">
            Accepts 10-second MP4/WebM videos, direct URLs, or local path (`/videos/hero-banner.mp4`).
          </p>
        </div>
        {currentVideoUrl ? (
          <div className="flex items-center gap-2">
            <span className="font-label-eyebrow text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
              Video Slide Active
            </span>
            <button
              type="button"
              onClick={() => onVideoChange("")}
              className="text-xs text-error hover:underline font-medium"
            >
              Remove Video
            </button>
          </div>
        ) : (
          <span className="font-label-eyebrow text-[10px] text-on-surface-variant bg-surface-container px-2.5 py-1 rounded">
            No Video Selected
          </span>
        )}
      </div>

      {uploadWarning && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-start gap-2">
          <span className="material-symbols-outlined text-base text-amber-600 shrink-0">info</span>
          <span>{uploadWarning}</span>
        </div>
      )}

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 flex flex-col sm:flex-row items-center gap-6 ${
          isDragging
            ? "border-secondary bg-secondary/5 scale-[1.01]"
            : "border-surface-variant/70 bg-surface-container-low hover:border-secondary/50"
        }`}
      >
        {/* Video Player Preview */}
        <div className="relative w-full sm:w-64 h-40 rounded-lg overflow-hidden border border-surface-variant bg-black shrink-0 shadow-sm group">
          {currentVideoUrl && !videoError ? (
            <>
              <video
                ref={videoRef}
                src={currentVideoUrl}
                poster={posterUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                onError={() => setVideoError(true)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-white/90 text-primary flex items-center justify-center hover:scale-105 transition-transform"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  <span className="material-symbols-outlined text-xl">
                    {isPlaying ? "pause" : "play_arrow"}
                  </span>
                </button>
              </div>
              <div className="absolute bottom-2 left-2 pointer-events-none">
                <span className="text-[10px] font-mono uppercase bg-black/60 text-white/90 px-1.5 py-0.5 rounded backdrop-blur-sm">
                  10s Loop Preview
                </span>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 text-xs gap-1.5 p-4 text-center">
              <span className="material-symbols-outlined text-3xl">movie</span>
              <span>{videoError ? "Unable to load video link" : "No video configured"}</span>
              {videoError && (
                <button
                  type="button"
                  onClick={() => setVideoError(false)}
                  className="text-[10px] text-secondary hover:underline"
                >
                  Retry
                </button>
              )}
            </div>
          )}
        </div>

        {/* Drop zone content */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-primary font-medium text-sm">
            <span className="material-symbols-outlined text-secondary text-xl">video_file</span>
            <span>Upload or drop 10-second banner video here</span>
          </div>
          <p className="text-xs text-on-surface-variant">
            Compatible formats: MP4 (H.264), WebM, or QuickTime MOV. Auto-plays silently in high definition.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-primary text-on-primary font-label-md text-xs uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors shadow-sm"
            >
              Browse Video Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        </div>
      </div>

      {/* Preset Luxury Bedding Gallery */}
      <div className="space-y-2 pt-1">
        <span className="font-label-eyebrow text-[10px] tracking-widest text-on-surface-variant uppercase">
          CURATED CINEMATIC MOTION PRESETS
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {PRESET_BEDDING_VIDEOS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setVideoError(false);
                onVideoChange(preset.url);
              }}
              className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                currentVideoUrl === preset.url
                  ? "border-secondary ring-2 ring-secondary/30 bg-secondary/5"
                  : "border-surface-variant/60 hover:border-secondary/40 bg-surface-container-low"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-secondary text-base">play_circle</span>
                <p className="text-xs font-medium text-primary truncate">{preset.name}</p>
              </div>
              <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom URL Input */}
      <div className="flex gap-2 pt-1">
        <input
          type="text"
          placeholder="Or paste video URL (e.g. https://.../video.mp4, or /videos/hero-banner.mp4)..."
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleApplyCustomUrl(e);
            }
          }}
          className="flex-1 px-3.5 py-2 text-xs rounded border border-surface-variant bg-surface-container-lowest text-primary placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary font-mono"
        />
        <button
          type="button"
          onClick={handleApplyCustomUrl}
          disabled={!customUrl.trim()}
          className="px-4 py-2 bg-surface-container hover:bg-surface-variant text-primary font-label-md text-xs uppercase tracking-wider rounded border border-surface-variant disabled:opacity-50 transition-colors"
        >
          Apply Video
        </button>
      </div>
    </div>
  );
}
