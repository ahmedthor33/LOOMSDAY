"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products-data";
import { ProductCard } from "@/components/product/ProductCard";

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "linen" | "cotton" | "down">("all");

  const filterProducts = () => {
    if (activeFilter === "linen") {
      return PRODUCTS.filter((p) => p.material.toLowerCase().includes("linen") || p.material.toLowerCase().includes("flax"));
    }
    if (activeFilter === "cotton") {
      return PRODUCTS.filter((p) => p.material.toLowerCase().includes("cotton") || p.material.toLowerCase().includes("sateen"));
    }
    if (activeFilter === "down") {
      return PRODUCTS.filter((p) => p.material.toLowerCase().includes("down") || p.category === "duvets");
    }
    return PRODUCTS.slice(0, 4); // Top 4 Bestsellers for landing page
  };

  const displayedProducts = filterProducts();

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION */}
      <section className="relative w-full -mt-28 min-h-[92vh] flex items-end pb-16 overflow-hidden bg-surface-container-low">
        {/* Background Editorial Image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-1000 ease-out scale-105"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCoGCxLRkGRSWdD8voHI2u-XCUnQDKQ3mQQsYCUqsJ-kcA4_6x8bU-OixgB8TyNmN6w6VyIDZdCuSiiwIqqdqbdNuAmeKAmoJB-iUfoXfbjZwj8VoLafvdEqHBYHPrmMZe_QZPA-EVV-tDPlZaLgsqaruaxYXpoep80TRrwZ1YpLN_4KxOS-3H80raCY6_hwrQXLDn_0GJ32s3smXhWddjDEJvU5D--awWchyxPA1OyNe9hpLzfUItXDQ')",
          }}
        />

        {/* Scrim overlays for pure editorial contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/35 to-primary/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-transparent to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 pt-44">
          <div className="max-w-2xl text-on-primary space-y-6">
            <div className="inline-flex items-center gap-3">
              <span className="w-8 h-[1px] bg-secondary-fixed" />
              <span className="font-label-eyebrow text-label-eyebrow tracking-[0.25em] text-secondary-fixed uppercase">
                THE SPRING LINEN COLLECTION
              </span>
            </div>

            <h1 className="font-display-hero text-display-hero tracking-tight leading-[1.08] text-surface font-normal">
              Sleep, <span className="italic font-display-hero text-secondary-fixed">elevated.</span>
            </h1>

            <p className="font-body-lg text-body-lg text-surface-container-low max-w-xl font-light">
              Woven in Northern France from 100% certified organic flax. Impossibly soft from night one, tailored for a lifetime of quiet rest.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-6">
              <Link
                href="/shop"
                className="px-8 py-4 bg-surface text-primary font-label-md text-label-md uppercase tracking-widest hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-all duration-300 shadow-xl hover:-translate-y-0.5 rounded"
              >
                Shop the Collection
              </Link>
              <Link
                href="/shop/duvets"
                className="group flex items-center gap-2 text-secondary-fixed font-label-md text-label-md uppercase tracking-widest hover:text-surface transition-colors py-3"
              >
                <span>Discover Duvets</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1.5 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-16 flex items-center justify-between text-surface/70 pt-6 border-t border-surface/20">
            <div className="flex items-center gap-3">
              <div className="w-4 h-7 rounded-full flex items-start justify-center p-1 bg-surface/20 backdrop-blur-sm">
                <div className="w-1 h-2 bg-surface rounded-full animate-bounce" />
              </div>
              <span className="font-label-eyebrow text-[10px] tracking-[0.25em] uppercase text-surface/90">
                SCROLL TO EXPLORE
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-surface/80 font-label-sm text-label-sm">
              <span>01 / 05</span>
              <span className="w-12 h-[1px] bg-surface/30" />
              <span className="italic font-headline-sm text-[15px]">Normandy Flax Origin</span>
            </div>
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
                <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-md px-3 py-1 text-on-surface font-label-sm text-label-sm uppercase tracking-widest rounded-sm">
                  From $160
                </div>
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
                <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-md px-3 py-1 text-on-surface font-label-sm text-label-sm uppercase tracking-widest rounded-sm">
                  From $75
                </div>
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
                <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-md px-3 py-1 text-on-surface font-label-sm text-label-sm uppercase tracking-widest rounded-sm">
                  From $240
                </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest hover:bg-neutral-800 transition-colors rounded shadow-sm"
            >
              <span>View All 24 Rest Pieces</span>
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
                <p className="font-label-md text-primary font-medium">Eleanor Vane</p>
                <p className="font-body-sm text-xs text-on-surface-variant">Verified Collector • New York</p>
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
                <p className="font-label-md text-primary font-medium">Julian Thorne</p>
                <p className="font-body-sm text-xs text-on-surface-variant">Architectural Designer • Copenhagen</p>
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
                <p className="font-label-md text-primary font-medium">Amara C.</p>
                <p className="font-body-sm text-xs text-on-surface-variant">Verified Collector • London</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
