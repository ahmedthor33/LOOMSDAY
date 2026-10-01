"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

interface DragDropImageUploadProps {
  currentImageUrl: string;
  onImageChange: (newUrl: string) => void;
  label?: string;
  recommendedAspect?: string;
}

const PRESET_BEDDING_IMAGES = [
  {
    name: "Sanctuary Dawn (Local 8K)",
    url: "/images/hero-bedding.jpg",
  },
  {
    name: "Warm Ivory Flax Drape",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4-I1K4vbNsICIYjZwoz76sC8eark0SaLCinQ02L5WbuHtIK9LKjZHfbdct-MVjWJSFfhuGfB7cdqZigy00l7f5qJANIQ7KWF5_og5iivfRMvVDcdTsEP7fPkt5RehCVzYUPKR7JagrOTXZlR3QyYU4L2H5WQSLA0MRUHM4ZB0sniWUsXZGquPIyFldicPjdfkWIyhoGllR5wOP4SOGxscuAPOLf7YSSpnJNZp3kRWAy-JthZi_vhtBQ",
  },
  {
    name: "Volcanic Pumice Washed Linen",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRofftqisNFZnAIUSYleRpMVRqPllNKXpPVacXAK44OvIFuLdg_JofE-s4TefFOv0XqwHfIXu3fTbRpyORmEUf10FMtUz6AQOTCIZDPelG4gnMnKzebeLXDiuBNcXtLWw4g72Ult4i64ZI7H2s0DlKcx5-M61Q_uC0RFj9hlwhH9vkIMgNARCiaVUT21pKMT8fS0fAVjkCmtTGUqqkQasl15UlqJQGriO9-sQPgX1Utcp3icKTgrtlqw",
  },
  {
    name: "Cloud Goose Down Billow",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDiLMU9kFaUz1KJVZYxlqcdVVgrYrcr0LTQtSVR2DGIgnRmWMfYpQrzHABD9WkR_lHMnkQ1W8jrO0PBurY1hDPcmBeFsCo-WEGFg6L19JTAlpqrQNsBgXBSF_UopJpM2FTYSOfLGaY2tq0kvRXgN_Lb7mtF-6QQ3XgWMJIp1pwcaEInGoCAVYHprnIJm3vDVSjipgnetecfX-UErZi9HxOCZubt-PWeghCP4qtPN9SlLSqvkVQNXq_I3w",
  },
  {
    name: "Muted Sage Heirloom Cover",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtOoYRRk0vGHuHkhoXB0ih8gsU0xTM_GGMq5APfzivgWXTvPdiG1uI5jfW5mWymwl1GqLYK1sXDsPR60PueZgV_M9jJ6mR4_ORPyDSiIL6iowMgRPg0-4jAEit5AXiKX7v-AEly6B792PSm3XJMHU-6RS572no-rMjGSSppdgxpLhDfgv4UU7c6EJ6R15wlZW6Qn1QOO6xcHPjvGne-45X8aJ-DoUpGwVFICvJVHXa8qcD5tp2I1-uMg",
  },
];

export function DragDropImageUpload({
  currentImageUrl,
  onImageChange,
  label = "Hero Editorial Banner Image",
  recommendedAspect = "16:9 Landscape (Ultra HD)",
}: DragDropImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPEG, PNG, WEBP, AVIF).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        onImageChange(e.target.result);
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
      onImageChange(customUrl.trim());
      setCustomUrl("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block font-label-md text-sm text-primary font-medium">{label}</label>
          <p className="font-body-sm text-xs text-on-surface-variant">
            Recommended: {recommendedAspect}. Drag and drop, select files, or pick luxury presets.
          </p>
        </div>
        {currentImageUrl && (
          <span className="font-label-eyebrow text-[10px] text-secondary uppercase tracking-widest bg-secondary/10 px-2.5 py-1 rounded">
            Live Preview Active
          </span>
        )}
      </div>

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
        {/* Current Image Preview */}
        <div className="relative w-full sm:w-56 h-36 rounded-lg overflow-hidden border border-surface-variant bg-surface-container-highest shrink-0 shadow-sm group">
          {currentImageUrl ? (
            <>
              {currentImageUrl.startsWith("data:") || currentImageUrl.startsWith("/") || currentImageUrl.startsWith("http") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentImageUrl}
                  alt="Editorial Banner"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : null}
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-on-primary text-xs font-label-md tracking-wider uppercase bg-primary/80 px-2 py-1 rounded">
                  Current Asset
                </span>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant text-xs gap-1">
              <span className="material-symbols-outlined text-3xl">image</span>
              <span>No image chosen</span>
            </div>
          )}
        </div>

        {/* Drop zone content */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-primary font-medium text-sm">
            <span className="material-symbols-outlined text-secondary text-xl">cloud_upload</span>
            <span>Drag and drop editorial asset here</span>
          </div>
          <p className="text-xs text-on-surface-variant">
            Accepts ultra-high-resolution JPEG, PNG, WEBP, or modern AVIF formats.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-primary text-on-primary font-label-md text-xs uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors shadow-sm"
            >
              Browse Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        </div>
      </div>

      {/* Preset Luxury Bedding Gallery */}
      <div className="space-y-2 pt-1">
        <span className="font-label-eyebrow text-[10px] tracking-widest text-on-surface-variant uppercase">
          CURATED HIGH-RESOLUTION ATELIER PRESETS
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {PRESET_BEDDING_IMAGES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onImageChange(preset.url)}
              className={`relative rounded-lg overflow-hidden border p-1 text-left transition-all ${
                currentImageUrl === preset.url
                  ? "border-secondary ring-2 ring-secondary/30 bg-surface-container"
                  : "border-surface-variant/60 hover:border-secondary/40 bg-surface-container-low"
              }`}
            >
              <div className="relative h-16 w-full rounded overflow-hidden mb-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preset.url}
                  alt={preset.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[11px] font-medium text-primary truncate px-0.5">{preset.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom URL Input */}
      <div className="flex gap-2 pt-1">
        <input
          type="url"
          placeholder="Or paste an image URL (e.g. Supabase Storage, CDN, Unsplash)..."
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleApplyCustomUrl(e);
            }
          }}
          className="flex-1 px-3.5 py-2 text-xs rounded border border-surface-variant bg-surface-container-lowest text-primary placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary"
        />
        <button
          type="button"
          onClick={handleApplyCustomUrl}
          disabled={!customUrl.trim()}
          className="px-4 py-2 bg-surface-container hover:bg-surface-variant text-primary font-label-md text-xs uppercase tracking-wider rounded border border-surface-variant disabled:opacity-50 transition-colors"
        >
          Apply URL
        </button>
      </div>
    </div>
  );
}
