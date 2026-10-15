"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { PRODUCTS } from "@/lib/products-data";
import { ProductCard } from "@/components/product/ProductCard";
import { useAdminStore } from "@/store/useAdminStore";
import { idbGet } from "@/lib/robust-storage";
import { fetchSupabaseProducts } from "@/lib/catalog-service";

export default function HomePage() {
  const { cms, products } = useAdminStore();
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "linen" | "cotton" | "down">("all");

  useEffect(() => {
    let isCancelled = false;

    const syncProducts = async () => {
      // 1. Fast sync from localStorage
      try {
        const raw = localStorage.getItem("loomsday-admin-storage-v5");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed?.state?.products) && !isCancelled) {
            setLocalProducts(parsed.state.products);
          }
        }
      } catch {}

      // 2. Authoritative sync from IndexedDB
      try {
        const idbRaw = await idbGet("loomsday-admin-storage-v5");
        if (idbRaw) {
          const parsed = JSON.parse(idbRaw);
          if (Array.isArray(parsed?.state?.products) && !isCancelled) {
            setLocalProducts(parsed.state.products);
          }
        }
      } catch {}

      // 3. Live cloud sync from Supabase (pulls newly added products on any device)
      try {
        const cloudProds = await fetchSupabaseProducts();
        if (cloudProds && cloudProds.length > 0 && !isCancelled) {
          const mergedMap = new Map<string, Product>();
          cloudProds.forEach((p) => mergedMap.set(p.slug || p.id, p));
          PRODUCTS.forEach((p) => {
            if (!mergedMap.has(p.slug || p.id)) {
              mergedMap.set(p.slug || p.id, p);
            }
          });
          setLocalProducts(Array.from(mergedMap.values()));
        }
      } catch {}
    };

    syncProducts();
    window.addEventListener("storage", syncProducts);
    window.addEventListener("loomsday-products-updated", syncProducts);
    return () => {
      isCancelled = true;
      window.removeEventListener("storage", syncProducts);
      window.removeEventListener("loomsday-products-updated", syncProducts);
    };
  }, []);

  const allProducts = useMemo(() => {
    if (Array.isArray(products) && products.length > 0) {
      return products;
    }
    if (Array.isArray(localProducts) && localProducts.length > 0) {
      return localProducts;
    }
    return PRODUCTS.length > 0 ? PRODUCTS : [];
  }, [products, localProducts]);

  const filterProducts = () => {
    const list = allProducts;
    if (activeFilter === "linen") {
      return list.filter((p) => p.material.toLowerCase().includes("linen") || p.material.toLowerCase().includes("flax"));
    }
    if (activeFilter === "cotton") {
      return list.filter((p) => p.material.toLowerCase().includes("cotton") || p.material.toLowerCase().includes("sateen"));
    }
    if (activeFilter === "down") {
      return list.filter((p) => p.material.toLowerCase().includes("down") || p.category === "duvets");
    }
    return list;
  };

  const displayedProducts = filterProducts();

  // Hero media slider state
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isSliderPaused, setIsSliderPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const heroMode = cms?.hero?.activeMedia || "slider";
  const heroImageUrl =
    cms?.hero?.imageUrl && cms.hero.imageUrl.trim().length > 0
      ? cms.hero.imageUrl
      : "/images/hero-bedding.jpg";
  const heroVideoUrl =
    cms?.hero?.videoUrl && cms.hero.videoUrl.trim().length > 0
      ? cms.hero.videoUrl
      : "https://assets.mixkit.co/videos/preview/mixkit-folds-of-a-white-fabric-41007-large.mp4";
  const slideIntervalSec = Math.max(4, cms?.hero?.slideIntervalSeconds || 8);

  useEffect(() => {
    if (heroMode === "video") {
      setActiveSlide(1);
    } else if (heroMode === "image") {
      setActiveSlide(0);
    }
  }, [heroMode]);

  useEffect(() => {
    if (heroMode !== "slider" || isSliderPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
    }, slideIntervalSec * 1000);
    return () => clearInterval(timer);
  }, [heroMode, isSliderPaused, slideIntervalSec]);

  useEffect(() => {
    if (videoRef.current) {
      if (activeSlide === 1 && isVideoPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [activeSlide, isVideoPlaying]);

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION */}
      <section
        className="relative w-full -mt-28 min-h-[92vh] flex items-end pb-16 overflow-hidden bg-surface-container-low"
        onMouseEnter={() => setIsSliderPaused(true)}
        onMouseLeave={() => setIsSliderPaused(false)}
      >
        {/* SLIDE 0: Background Editorial Image */}
        <div
          className={`absolute inset-0 w-full h-full overflow-hidden transition-all duration-1000 ease-in-out ${
            activeSlide === 0
              ? "opacity-100 scale-100 z-0"
              : "opacity-0 scale-105 -z-10 pointer-events-none"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImageUrl}
            alt="LOOMSDAY French flax linen bedding in serene natural morning light"
            className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out"
            loading="eager"
            // @ts-expect-error fetchpriority is standard in modern browsers
            fetchpriority="high"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.endsWith("/images/hero-bedding.jpg")) {
                target.src = "/images/hero-bedding.jpg";
              }
            }}
          />
        </div>

        {/* SLIDE 1: Background Cinematic Video */}
        <div
          className={`absolute inset-0 w-full h-full overflow-hidden transition-all duration-1000 ease-in-out ${
            activeSlide === 1
              ? "opacity-100 scale-100 z-0"
              : "opacity-0 scale-105 -z-10 pointer-events-none"
          }`}
        >
          <video
            ref={videoRef}
            src={heroVideoUrl}
            poster={cms?.hero?.videoPosterUrl || heroImageUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center"
          >
            {/* Fallback image if video fails to stream */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImageUrl}
              alt="LOOMSDAY French flax linen bedding"
              className="w-full h-full object-cover object-center"
            />
          </video>
        </div>

        {/* Scrim overlays for pure editorial contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-primary/15 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 via-primary/30 to-transparent z-[1]" />

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 pt-44">
          <div className="max-w-2xl text-on-primary space-y-6">
            <div className="inline-flex items-center gap-3">
              <span className="w-8 h-[1px] bg-secondary-fixed" />
              <span className="font-label-eyebrow text-label-eyebrow tracking-[0.25em] text-secondary-fixed uppercase">
                {cms.hero.eyebrow}
              </span>
            </div>

            <h1 className="font-display-hero text-display-hero tracking-tight leading-[1.08] text-surface font-normal">
              {cms.hero.headline}
            </h1>

            <p className="font-body-lg text-body-lg text-surface-container-low max-w-xl font-light">
              {cms.hero.subheadline}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-6">
              <Link
                href={cms.hero.primaryCtaLink}
                className="px-8 py-4 bg-surface text-primary font-label-md text-label-md uppercase tracking-widest hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-all duration-300 shadow-xl hover:-translate-y-0.5 rounded"
              >
                {cms.hero.primaryCtaText}
              </Link>
              <Link
                href={cms.hero.secondaryCtaLink}
                className="group flex items-center gap-2 text-secondary-fixed font-label-md text-label-md uppercase tracking-widest hover:text-surface transition-colors py-3"
              >
                <span>{cms.hero.secondaryCtaText}</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1.5 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>

          {/* Interactive Slide Switcher & Scroll Indicator */}
          <div className="mt-16 flex flex-col sm:flex-row sm:items-center justify-between text-surface/80 pt-6 border-t border-surface/20 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-7 rounded-full flex items-start justify-center p-1 bg-surface/20 backdrop-blur-sm">
                <div className="w-1 h-2 bg-surface rounded-full animate-bounce" />
              </div>
              <span className="font-label-eyebrow text-[10px] tracking-[0.25em] uppercase text-surface/90">
                SCROLL TO EXPLORE
              </span>
            </div>

            {/* Slider Navigation Bar */}
            {heroMode === "slider" && (
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {/* 01 Photography Tab */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSlide(0);
                    setIsSliderPaused(true);
                  }}
                  className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-label-eyebrow uppercase tracking-widest transition-all ${
                    activeSlide === 0
                      ? "bg-surface text-primary shadow-lg font-semibold scale-105"
                      : "bg-surface/15 text-surface/80 hover:bg-surface/25 backdrop-blur-md border border-surface/20"
                  }`}
                  aria-label="Switch to Photography slide"
                >
                  <span className="material-symbols-outlined text-xs">photo_camera</span>
                  <span>01 / Photography</span>
                </button>

                {/* 02 Motion Film Tab */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSlide(1);
                    setIsSliderPaused(true);
                  }}
                  className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-label-eyebrow uppercase tracking-widest transition-all ${
                    activeSlide === 1
                      ? "bg-surface text-primary shadow-lg font-semibold scale-105"
                      : "bg-surface/15 text-surface/80 hover:bg-surface/25 backdrop-blur-md border border-surface/20"
                  }`}
                  aria-label="Switch to Motion Film video slide"
                >
                  <span className="material-symbols-outlined text-xs">play_circle</span>
                  <span>02 / Motion Film</span>
                </button>

                {/* Next & Prev Arrows */}
                <div className="flex items-center gap-1 pl-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
                      setIsSliderPaused(true);
                    }}
                    className="w-7 h-7 rounded-full bg-surface/15 hover:bg-surface/30 backdrop-blur-md text-surface border border-surface/20 flex items-center justify-center transition-all hover:scale-105"
                    title="Toggle slide"
                    aria-label="Previous slide"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
                      setIsSliderPaused(true);
                    }}
                    className="w-7 h-7 rounded-full bg-surface/15 hover:bg-surface/30 backdrop-blur-md text-surface border border-surface/20 flex items-center justify-center transition-all hover:scale-105"
                    title="Toggle slide"
                    aria-label="Next slide"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>

                {/* Video Play/Pause controller (when viewing video) */}
                {activeSlide === 1 && (
                  <button
                    type="button"
                    onClick={() => setIsVideoPlaying((p) => !p)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface/20 hover:bg-surface/30 backdrop-blur-md text-surface text-[10px] uppercase font-mono tracking-wider border border-surface/20 transition-all"
                    title={isVideoPlaying ? "Pause Video Motion" : "Play Video Motion"}
                    aria-label={isVideoPlaying ? "Pause Video Motion" : "Play Video Motion"}
                  >
                    <span className="material-symbols-outlined text-xs">
                      {isVideoPlaying ? "pause" : "play_arrow"}
                    </span>
                    <span>{isVideoPlaying ? "Pause Motion" : "Play Motion"}</span>
                  </button>
                )}
              </div>
            )}

            {/* If Single Image or Single Video mode */}
            {heroMode !== "slider" && (
              <div className="hidden sm:flex items-center gap-4 text-surface/80 font-label-sm text-label-sm">
                <span>{heroMode === "video" ? "Cinematic Motion" : "Editorial Stills"}</span>
                <span className="w-12 h-[1px] bg-surface/30" />
                <span className="italic font-headline-sm text-[15px]">Normandy Flax Origin</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY */}
      <section className="w-full py-20 bg-surface" id="categories">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-secondary font-label-eyebrow text-label-eyebrow uppercase tracking-widest">
                <span>✦</span>
                <span>CURATED ESSENTIALS</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                Woven for Every Layer of Sleep
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              Constructed with time-honored artisanal weaves. Each piece balances natural thermal regulation with an ethereal, stone-washed touch.
            </p>
          </div>

          {/* Category Architecture Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Bedsheets */}
            <Link
              href="/shop/bedsheets"
              className="group relative flex flex-col bg-surface-container overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 rounded"
            >
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-surface-container-high">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBUZzpp8szKlCaNHPJemnC7kx29DdEaV7E3I1TFOfneVOOybqWHexi6-MoM23vQoMPe-EnSSE2tUyGvgGr3ZTPpE86VvolITvNzUwRts0j1NCnviBoNlO5_6V-s6-RXuAB6NH9REQV0N-tMe6dClU48x6HFueH2sf_aGFB8ibRlDUBD9_BgcAkh1KkDa1a4b1KRICZQhiy1Da8CrR9z0C0iGTVN7zluXFgR4S8CVkA8M_avPXvxdVssvw')",
                  }}
                />
              </div>
              <div className="p-8 flex flex-col justify-between flex-grow space-y-4">
                <div className="space-y-2">
                  <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">
                    LAYER 01
                  </span>
                  <h3 className="font-headline-md text-headline-md text-primary">Bedsheets</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Fitted &amp; Flat French Linen and high-thread cotton sateen designed for immediate softness.
                  </p>
                </div>
                <div className="pt-4 flex items-center justify-between text-primary font-label-md text-label-md uppercase tracking-wider group-hover:text-secondary transition-colors">
                  <span>Explore Bedsheets</span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-2 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            </Link>

            {/* Card 2: Pillows & Covers */}
            <Link
              href="/shop/pillows"
              className="group relative flex flex-col bg-surface-container overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 md:-translate-y-4 rounded"
            >
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-surface-container-high">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB5mg_88uP4_dY0StskHnUAypeSbRoucIm9WT-4HR0oAhnQmLZpvQryGp9dRkRHXbywiF4rdugLcuMoRPigGYCT36DBSF4ZqUkql1Fvbv4FsJR7Z-jb_ZTKaPbn0S4wcKo0yT-u5NMEYIs4dhebchIyjiGTZhd7fCuNLNWfKcX7zNv15mR39syvFaPaBGXjvgohAlrO-ORZS36KvAyWx90TvMz_SjFMWmkOvTp5qjbh_7YVesL5Hn00kw')",
                  }}
                />
              </div>
              <div className="p-8 flex flex-col justify-between flex-grow space-y-4">
                <div className="space-y-2">
                  <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">
                    LAYER 02
                  </span>
                  <h3 className="font-headline-md text-headline-md text-primary">Pillows &amp; Covers</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Cloud-loft Down Pillows and pure linen envelope shams that elevate cervical relaxation.
                  </p>
                </div>
                <div className="pt-4 flex items-center justify-between text-primary font-label-md text-label-md uppercase tracking-wider group-hover:text-secondary transition-colors">
                  <span>Explore Pillows</span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-2 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            </Link>

            {/* Card 3: Duvets */}
            <Link
              href="/shop/duvets"
              className="group relative flex flex-col bg-surface-container overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 rounded"
            >
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-surface-container-high">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDiBCnikRLwnd_4Wsq2BV_wVpZaf2My8kvlRPBh3KSFqnjtzRILf4fjs0dPkKD450bxrZH7e861saDA3s6fi430jIcrvFomHmJ1oJU4UYdCmvwbz_FqXd6HYLM4L31NphUK7SlVEgJpOYsVajd7SbfUezj8omF6M9yskA3anvoBdPz7uH_qwNTjuJ2iZVgdlf5XF5jHKDFyRtQD5j2GsNoxvU_yFqfHBI1ldpcLIHZXhmgDsax5tSQKwA')",
                  }}
                />
              </div>
              <div className="p-8 flex flex-col justify-between flex-grow space-y-4">
                <div className="space-y-2">
                  <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">
                    LAYER 03
                  </span>
                  <h3 className="font-headline-md text-headline-md text-primary">Duvets &amp; Quilts</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    All-season breathable French flax covers paired with hypoallergenic goose-down inserts.
                  </p>
                </div>
                <div className="pt-4 flex items-center justify-between text-primary font-label-md text-label-md uppercase tracking-wider group-hover:text-secondary transition-colors">
                  <span>Explore Duvets</span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-2 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. BEST SELLERS PRODUCT GRID */}
      <section className="w-full py-20 bg-surface-container-low" id="bestsellers">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
            <div>
              <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">
                ICONIC SLEEP ARCHIVE
              </span>
              <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight mt-2">
                The Rest Suite Favorites
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-surface-container rounded-full">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className={`px-5 py-2 rounded-full font-label-sm text-label-sm uppercase tracking-wider transition-all duration-200 ${
                  activeFilter === "all"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                All Rest Items
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("linen")}
                className={`px-5 py-2 rounded-full font-label-sm text-label-sm uppercase tracking-wider transition-all duration-200 ${
                  activeFilter === "linen"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                Organic Linen
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("cotton")}
                className={`px-5 py-2 rounded-full font-label-sm text-label-sm uppercase tracking-wider transition-all duration-200 ${
                  activeFilter === "cotton"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                Cotton Sateen
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("down")}
                className={`px-5 py-2 rounded-full font-label-sm text-label-sm uppercase tracking-wider transition-all duration-200 ${
                  activeFilter === "down"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                Down Inserts
              </button>
            </div>
          </div>

          {/* 4-Col Product Grid */}
          {displayedProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-surface-container-low rounded-2xl p-8 border border-surface-variant/30 max-w-xl mx-auto">
              <span className="material-symbols-outlined text-4xl text-secondary">bedtime</span>
              <h3 className="font-headline-sm text-xl text-primary font-serif">Curating New Bedding Pieces</h3>
              <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                Our Normandy artisans and master tailors are weaving the next suite of heirloom French flax linen. Check back shortly or explore our bespoke collections.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest hover:bg-neutral-800 transition-colors rounded shadow-sm"
            >
              <span>Explore The Collection</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. BRAND STORY SECTION (SPLIT EDITORIAL) */}
      <section className="w-full py-24 bg-surface" id="craft">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Imagery Bento Mosaic */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4 relative">
              <div className="space-y-4">
                <div className="aspect-[3/4] overflow-hidden bg-surface-container shadow-md rounded">
                  <div
                    className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-700 ease-out"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAI39radfHwgDIzBZz_Kue_oOR3GL8x3I2ahCC8MrPnUPgYlP4KtFAxUm3Mz4dQMj9CR9cWHMmavyzuw81SVpL_RPebnmnZ9AjNz1wEsaKi9Oi890nLdHH6YUtyguUQpAWD2URBmHL2oUhMhOEr8EDjjch2QwZDAojyy3qAsw9YSyBPCq3T_aoXEJ8v6lu24q995UivFns1-YNwl4ICIW_-6juMjaKwTUWWNbjkNDFplsyNyfnfcvvavA')",
                    }}
                  />
                </div>
                <div className="p-6 bg-surface-container flex flex-col justify-center rounded">
                  <span className="font-display-hero text-headline-lg text-secondary">0.0%</span>
                  <span className="font-label-md text-label-md uppercase tracking-wider text-primary mt-1 font-medium">
                    Harmful Chemicals
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                    Zero formaldehyde, phthalates, or harsh silicones touch our raw harvested European yarn.
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="p-6 bg-primary text-on-primary flex flex-col justify-between aspect-square rounded">
                  <span className="font-label-eyebrow text-label-eyebrow tracking-widest uppercase text-secondary-fixed">
                    HERITAGE MILL
                  </span>
                  <p className="font-headline-sm text-headline-sm leading-snug">
                    Washed in volcanic pumice stones for weightless hand-feel.
                  </p>
                  <span className="font-label-sm text-label-sm text-surface-container-high">Normandy • Est. 1928</span>
                </div>
                <div className="aspect-[3/4] overflow-hidden bg-surface-container shadow-md rounded">
                  <div
                    className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-700 ease-out"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDcTqr3Iw0ZNL0O97joMCjUUZSzFOMBYsFrPqbkg_PvxKWbmy0ySU8SokAwFx3jqiT-AFDPRcBaje_HY6DGyYUeBt3yXfXtLGaH2KV6gyMZM4hdIppG6P44RjZmwW_Vqo79vV8aPGKBEQ9woZ0gX_D66Ez3cX1bMQsuzzcOtdaaoH1j_Nvw-cFcc2qP98g8hOMzW743nyoVAiHBCzOlZiqidTNv_eqbHbxlEX2ysyv925zQcDdjLeYM4Q')",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right Editorial Narrative */}
            <div className="lg:col-span-6 space-y-8 pl-0 lg:pl-6">
              <div className="space-y-3">
                <span className="font-label-eyebrow text-label-eyebrow tracking-widest uppercase text-secondary">
                  THE PROVENANCE
                </span>
                <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                  Born from an Obsession with Rest
                </h2>
              </div>

              <div className="space-y-5 text-on-surface-variant font-body-md text-body-md leading-relaxed">
                <p>
                  Most modern bedding relies on chemical softeners—silicone baths designed to wash out after two cycles, leaving stiff, abrasive threads against your skin. We took the unhurried path.
                </p>
                <p>
                  In the maritime climate of Normandy, damp sea breezes and nutrient-rich silt yield the world’s longest, most durable flax fibers. Harvested by hand and steeped in volcanic pumice baths, our linens achieve an effortless, lived-in softness straight from the package.
                </p>
              </div>

              {/* Artisanal Metrics */}
              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-surface-variant/40">
                <div>
                  <span className="font-headline-sm text-2xl text-primary font-medium">100%</span>
                  <span className="font-label-eyebrow text-[10px] text-on-surface-variant uppercase tracking-wider block mt-1">
                    Organic Normandy Flax
                  </span>
                </div>
                <div>
                  <span className="font-headline-sm text-2xl text-primary font-medium">175 GSM</span>
                  <span className="font-label-eyebrow text-[10px] text-on-surface-variant uppercase tracking-wider block mt-1">
                    Optimal All-Season Weft
                  </span>
                </div>
                <div>
                  <span className="font-headline-sm text-2xl text-primary font-medium">10-Year</span>
                  <span className="font-label-eyebrow text-[10px] text-on-surface-variant uppercase tracking-wider block mt-1">
                    Atelier Seam Guarantee
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EDITORIAL PRESS & REVIEWS */}
      <section className="w-full py-20 bg-surface-container-low border-t border-surface-variant/30" id="reviews">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="font-label-eyebrow text-label-eyebrow uppercase text-secondary tracking-widest">
              SANCTUARY CRITIQUE
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary">Praised in the Quietest Rooms</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              From historic European hotels to private coastal estates, LOOMSDAY restores the ritual of rest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-surface rounded shadow-sm space-y-4 border border-surface-variant/30">
              <div className="flex text-secondary">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                ))}
              </div>
              <blockquote className="font-headline-sm text-lg text-primary italic font-normal leading-snug">
                &ldquo;The drape of the French flax sheets feels like slipping into the linens of an ancient villa in Provence. Impossibly soft from day one.&rdquo;
              </blockquote>
              <div className="pt-2">
                <p className="font-label-md text-primary font-medium">Amina R.</p>
                <p className="font-body-sm text-xs text-on-surface-variant">Verified Collector • Lahore</p>
              </div>
            </div>

            <div className="p-8 bg-surface rounded shadow-sm space-y-4 border border-surface-variant/30">
              <div className="flex text-secondary">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                ))}
              </div>
              <blockquote className="font-headline-sm text-lg text-primary italic font-normal leading-snug">
                &ldquo;The Cloud Goose Down insert is a masterpiece of thermal regulation. Weightless yet deeply comforting throughout chilly winter nights.&rdquo;
              </blockquote>
              <div className="pt-2">
                <p className="font-label-md text-primary font-medium">Julian T.</p>
                <p className="font-body-sm text-xs text-on-surface-variant">Architectural Designer • Islamabad</p>
              </div>
            </div>

            <div className="p-8 bg-surface rounded shadow-sm space-y-4 border border-surface-variant/30">
              <div className="flex text-secondary">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                ))}
              </div>
              <blockquote className="font-headline-sm text-lg text-primary italic font-normal leading-snug">
                &ldquo;I have thrown away all our old sateen sets. LOOMSDAY represents the golden age of slow textile weaving.&rdquo;
              </blockquote>
              <div className="pt-2">
                <p className="font-label-md text-primary font-medium">Zainab K.</p>
                <p className="font-body-sm text-xs text-on-surface-variant">Verified Collector • Karachi</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
