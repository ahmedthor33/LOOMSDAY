"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CustomCategory } from "@/types";
import { useAdminStore, DEFAULT_CATEGORIES } from "@/store/useAdminStore";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory?: (categorySlug: string) => void;
}

const ICON_PRESETS = [
  { icon: "bed", label: "Bed" },
  { icon: "filter_vintage", label: "Pillow / Flower" },
  { icon: "single_bed", label: "Duvet / Single" },
  { icon: "checkroom", label: "Apparel / Robes" },
  { icon: "waves", label: "Throws / Drapes" },
  { icon: "spa", label: "Bath & Wellness" },
  { icon: "texture", label: "Linen Weave" },
  { icon: "style", label: "Accessories" },
  { icon: "favorite", label: "Curated" },
  { icon: "star", label: "Luxury" },
];

export function CategoryModal({ isOpen, onClose, onSelectCategory }: CategoryModalProps) {
  const { categories, addCategory, updateCategory, deleteCategory, resetCategories, products } = useAdminStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("bed");
  const [imageUrl, setImageUrl] = useState("");
  const [displayInNav, setDisplayInNav] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentCategories = Array.isArray(categories) && categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategoryId) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generated);
      if (!subtitle) {
        setSubtitle(`COLLECTION : ${val.toUpperCase()}`);
      }
    }
  };

  const handleStartEdit = (cat: CustomCategory) => {
    setEditingCategoryId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setSubtitle(cat.subtitle || "");
    setDescription(cat.description || "");
    setIcon(cat.icon || "bed");
    setImageUrl(cat.imageUrl || "");
    setDisplayInNav(cat.displayInNav !== false);
    setFormError(null);
    setFormSuccess(null);
    setIsFormOpen(true);
  };

  const handleResetForm = () => {
    setEditingCategoryId(null);
    setName("");
    setSlug("");
    setSubtitle("");
    setDescription("");
    setIcon("bed");
    setImageUrl("");
    setDisplayInNav(true);
    setFormError(null);
    setFormSuccess(null);
    setIsFormOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const cleanName = name.trim();
    if (!cleanName) {
      setFormError("Category Name is required.");
      return;
    }

    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    if (!cleanSlug) {
      setFormError("A valid URL slug is required.");
      return;
    }

    if (editingCategoryId) {
      // Updating
      updateCategory(editingCategoryId, {
        name: cleanName,
        slug: cleanSlug,
        subtitle: subtitle.trim(),
        description: description.trim(),
        icon,
        imageUrl: imageUrl.trim() || undefined,
        displayInNav,
      });
      setFormSuccess(`Updated "${cleanName}" category successfully.`);
      setTimeout(() => {
        handleResetForm();
      }, 900);
    } else {
      // Creating
      const res = addCategory({
        id: `cat-${cleanSlug}-${Date.now().toString(36)}`,
        name: cleanName,
        slug: cleanSlug,
        subtitle: subtitle.trim() || `COLLECTION : ${cleanName.toUpperCase()}`,
        description: description.trim(),
        icon,
        imageUrl: imageUrl.trim() || "/images/hero-bedding.jpg",
        displayInNav,
        isDefault: false,
      });

      if (!res.success) {
        setFormError(res.error || "Failed to create category.");
        return;
      }

      setFormSuccess(`Added "${cleanName}" to boutique categories!`);
      if (onSelectCategory) {
        onSelectCategory(cleanSlug);
      }
      setTimeout(() => {
        handleResetForm();
      }, 900);
    }
  };

  const handleDelete = (cat: CustomCategory) => {
    if (cat.isDefault) {
      alert("System categories (Bedsheets, Pillows, Duvets) cannot be deleted.");
      return;
    }

    const assignedCount = products.filter(
      (p) => p.category === cat.slug || p.category === cat.id
    ).length;

    if (assignedCount > 0) {
      alert(
        `Cannot delete "${cat.name}" because ${assignedCount} ${
          assignedCount === 1 ? "product is" : "products are"
        } currently assigned to it. Please reassign or delete those products first.`
      );
      return;
    }

    if (confirm(`Are you sure you want to delete the "${cat.name}" category?`)) {
      const res = deleteCategory(cat.id);
      if (!res.success) {
        alert(res.error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl bg-surface-container-lowest border border-surface-variant overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-surface-variant/40 flex items-center justify-between bg-surface-container-low shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-2xl">category</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm text-lg text-primary font-medium">
                  Boutique Categories & Silhouettes
                </h2>
                <span className="text-[11px] font-mono bg-secondary/15 text-secondary px-2 py-0.5 rounded-full font-semibold">
                  {currentCategories.length} Categories
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Organize your catalog silhouettes, storefront navigation, and collection landing pages.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isFormOpen && (
              <button
                type="button"
                onClick={() => {
                  setEditingCategoryId(null);
                  setName("");
                  setSlug("");
                  setSubtitle("");
                  setDescription("");
                  setIcon("bed");
                  setImageUrl("");
                  setDisplayInNav(true);
                  setFormError(null);
                  setFormSuccess(null);
                  setIsFormOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-on-primary text-xs font-label-md uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Add Category</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Add / Edit Form Card */}
          {isFormOpen && (
            <div className="p-5 rounded-xl bg-surface border border-secondary/30 shadow-md space-y-4 animate-in slide-in-from-top-3 duration-200">
              <div className="flex items-center justify-between border-b border-surface-variant/40 pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-lg">
                    {editingCategoryId ? "edit_note" : "add_circle"}
                  </span>
                  <h3 className="font-headline-sm text-sm text-primary font-medium">
                    {editingCategoryId ? `Edit Category: ${name}` : "Create New Boutique Category"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="text-xs text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                  <span>Cancel</span>
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">warning</span>
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>{formSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-primary mb-1">
                      Category Display Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Throws & Blankets, Silk Pillowcases, Robes"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-primary mb-1 flex items-center justify-between">
                      <span>URL Path / Slug *</span>
                      <span className="text-[10px] text-on-surface-variant font-mono">
                        /shop/{slug || "category-slug"}
                      </span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. throws-and-blankets"
                      value={slug}
                      onChange={(e) =>
                        setSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]+/g, "-")
                        )
                      }
                      className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary font-mono focus:outline-none focus:border-secondary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-primary mb-1">
                      Hierarchy Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. LAYER 04 : TEXTURAL WARMTH"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary uppercase text-[11px] tracking-wider focus:outline-none focus:border-secondary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-primary mb-1">
                      Hero Banner Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://... or /images/hero-bedding.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-primary mb-1">
                    Editorial Collection Narrative
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Short description displayed on the category landing page banner..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-surface-variant bg-surface text-primary focus:outline-none focus:border-secondary resize-none"
                  />
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-xs font-medium text-primary mb-1.5">
                    Silhouette Icon Identifier
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {ICON_PRESETS.map((item) => (
                      <button
                        key={item.icon}
                        type="button"
                        onClick={() => setIcon(item.icon)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-colors ${
                          icon === item.icon
                            ? "border-secondary bg-secondary/15 text-secondary font-medium shadow-xs"
                            : "border-surface-variant bg-surface-container-low text-on-surface-variant hover:border-secondary/50"
                        }`}
                        title={item.label}
                      >
                        <span className="material-symbols-outlined text-sm">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Display In Navigation */}
                <div className="flex items-center justify-between pt-2 border-t border-surface-variant/40">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-primary">
                    <input
                      type="checkbox"
                      checked={displayInNav}
                      onChange={(e) => setDisplayInNav(e.target.checked)}
                      className="rounded accent-secondary w-4 h-4"
                    />
                    <div>
                      <span className="font-medium">Show in Main Boutique Navigation</span>
                      <p className="text-[10px] text-on-surface-variant font-normal">
                        Appears automatically in top header links and mobile menu drawer
                      </p>
                    </div>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="px-3 py-1.5 rounded border border-surface-variant text-xs text-on-surface-variant hover:text-primary transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded bg-primary text-on-primary text-xs font-medium hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {editingCategoryId ? "save" : "check"}
                      </span>
                      <span>{editingCategoryId ? "Update Category" : "Save Category"}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Active Categories List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-label-md uppercase tracking-wider text-on-surface-variant">
                Active Catalog Silhouettes ({currentCategories.length})
              </h3>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Reset categories back to original 3 factory defaults (Bedsheets, Pillows, Duvets)?")) {
                    resetCategories();
                  }
                }}
                className="text-[11px] text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-xs">restart_alt</span>
                <span>Reset to System Defaults</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {currentCategories.map((cat) => {
                const assignedProducts = products.filter(
                  (p) => p.category === cat.slug || p.category === cat.id
                );
                return (
                  <div
                    key={cat.id || cat.slug}
                    className="p-4 rounded-xl bg-surface-container-low border border-surface-variant/50 hover:border-surface-variant transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-surface border border-surface-variant flex items-center justify-center text-primary shrink-0">
                            <span className="material-symbols-outlined text-lg">
                              {cat.icon || "category"}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-headline-sm text-sm text-primary font-medium">
                                {cat.name}
                              </h4>
                              {cat.isDefault && (
                                <span className="text-[9px] uppercase tracking-wider font-semibold bg-surface-variant/70 text-on-surface-variant px-1.5 py-0.2 rounded">
                                  Default
                                </span>
                              )}
                              {cat.displayInNav !== false ? (
                                <span className="text-[9px] uppercase tracking-wider font-semibold bg-emerald-500/10 text-emerald-700 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                  In Nav
                                </span>
                              ) : (
                                <span className="text-[9px] uppercase tracking-wider font-semibold bg-neutral-200 text-neutral-600 px-1.5 py-0.2 rounded">
                                  Hidden from Nav
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-on-surface-variant font-mono">
                              /shop/{cat.slug}
                            </span>
                          </div>
                        </div>

                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-surface text-primary border border-surface-variant/40 shrink-0 font-medium">
                          {assignedProducts.length} {assignedProducts.length === 1 ? "item" : "items"}
                        </span>
                      </div>

                      {cat.subtitle && (
                        <p className="text-[10px] text-secondary font-semibold uppercase tracking-wider mt-2">
                          {cat.subtitle}
                        </p>
                      )}

                      {cat.description && (
                        <p className="text-xs text-on-surface-variant line-clamp-2 mt-1 font-body-sm">
                          {cat.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-surface-variant/30 text-xs">
                      <Link
                        href={`/shop/${cat.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-[11px] text-secondary hover:underline font-medium"
                      >
                        <span>View Collection</span>
                        <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                      </Link>

                      <div className="flex items-center gap-2">
                        {onSelectCategory && (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectCategory(cat.slug);
                              onClose();
                            }}
                            className="px-2 py-1 rounded bg-secondary/10 hover:bg-secondary/20 text-secondary text-[11px] font-medium transition-colors"
                          >
                            Select for Product
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleStartEdit(cat)}
                          className="px-2 py-1 rounded hover:bg-surface text-on-surface-variant hover:text-primary text-[11px] font-medium transition-colors"
                        >
                          Edit
                        </button>

                        {!cat.isDefault && (
                          <button
                            type="button"
                            onClick={() => handleDelete(cat)}
                            className="px-2 py-1 rounded hover:bg-error/10 text-error text-[11px] font-medium transition-colors"
                            title="Delete custom category"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-surface-variant/40 bg-surface-container-low flex items-center justify-between shrink-0 text-xs text-on-surface-variant">
          <span>Categories synchronize across product listings, storefront navigation, and catalog filters.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-surface border border-surface-variant text-primary hover:border-secondary text-xs font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
