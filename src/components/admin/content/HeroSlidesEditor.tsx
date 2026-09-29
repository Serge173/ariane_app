"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

import type { HeroSlideSettings } from "@/lib/homepage-settings";

import { createEmptyHeroSlide, reorderHeroSlide } from "@/lib/homepage-settings";

import { HeroSlidePreviewModal } from "@/components/admin/content/HeroSlidePreviewModal";

import { HeroSlideEditModal } from "@/components/admin/content/HeroSlideEditModal";



export function HeroSlidesEditor({

  slides,

  canEdit,

  onChange,

  uploadingIndex,

  onUpload,

  onUploadImage,

  onSaveSlides,

}: {

  slides: HeroSlideSettings[];

  canEdit: boolean;

  onChange: (slides: HeroSlideSettings[]) => void;

  uploadingIndex: number | null;

  onUpload: (index: number, file: File) => void;

  onUploadImage: (file: File) => Promise<string | null>;

  onSaveSlides: (slides: HeroSlideSettings[]) => Promise<boolean>;

}) {

  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [editUploading, setEditUploading] = useState(false);

  const [editSaving, setEditSaving] = useState(false);

  const [editDraftImage, setEditDraftImage] = useState<string | null>(null);



  const updateSlide = (index: number, patch: Partial<HeroSlideSettings>) => {

    const next = [...slides];

    next[index] = { ...next[index], ...patch };

    onChange(next);

  };



  const addSlide = () => {

    const slide = createEmptyHeroSlide(slides.length);

    onChange([...slides, slide]);

    setEditIndex(slides.length);

  };



  const removeSlide = (index: number) => {

    if (slides.length <= 1) return;

    onChange(slides.filter((_, i) => i !== index));

    if (previewIndex === index) setPreviewIndex(null);

    else if (previewIndex !== null && previewIndex > index) setPreviewIndex(previewIndex - 1);

    if (editIndex === index) setEditIndex(null);

    else if (editIndex !== null && editIndex > index) setEditIndex(editIndex - 1);

  };



  const toggleSuspend = (index: number) => {

    updateSlide(index, { suspended: !slides[index].suspended });

  };



  const openEdit = (index: number) => {

    setPreviewIndex(null);

    setEditDraftImage(null);

    setEditIndex(index);

  };



  const handleEditUpload = async (file: File) => {

    setEditUploading(true);

    try {

      const url = await onUploadImage(file);

      if (url) setEditDraftImage(url);

    } finally {

      setEditUploading(false);

    }

  };



  const handleEditSave = async (updated: HeroSlideSettings, listPosition1Based: number) => {

    if (editIndex === null) return;

    const withImage = editDraftImage ? { ...updated, image: editDraftImage } : updated;

    const nextSlides = reorderHeroSlide(slides, editIndex, withImage, listPosition1Based);

    setEditSaving(true);

    try {

      const ok = await onSaveSlides(nextSlides);

      if (ok) {

        onChange(nextSlides);

        setEditIndex(null);

        setEditDraftImage(null);

      }

    } finally {

      setEditSaving(false);

    }

  };



  const activeCount = slides.filter((s) => !s.suspended).length;

  const activePosition = (index: number) => {

    let rank = 0;

    for (let i = 0; i <= index; i++) {

      if (!slides[i].suspended) rank += 1;

    }

    return slides[index].suspended ? 0 : rank;

  };



  return (

    <>

      {previewIndex !== null && slides[previewIndex] && (

        <HeroSlidePreviewModal

          slide={slides[previewIndex]}

          listPosition={previewIndex + 1}

          listTotal={slides.length}

          carouselPosition={activePosition(previewIndex)}

          carouselTotal={activeCount > 0 ? activeCount : slides.length}

          onClose={() => setPreviewIndex(null)}

          onModify={canEdit ? () => openEdit(previewIndex) : undefined}

          onStatusChange={

            canEdit

              ? (active) => {

                  if (previewIndex === null) return;

                  updateSlide(previewIndex, { suspended: !active });

                }

              : undefined

          }

        />

      )}



      {editIndex !== null && slides[editIndex] && canEdit && (

        <HeroSlideEditModal

          key={slides[editIndex].id}

          listPosition={editIndex + 1}

          listTotal={slides.length}

          carouselPosition={activePosition(editIndex)}

          carouselTotal={activeCount > 0 ? activeCount : slides.length}

          slide={slides[editIndex]}

          pendingImageUrl={editDraftImage}

          uploading={editUploading || uploadingIndex === editIndex}

          saving={editSaving}

          onClose={() => {

            if (editSaving) return;

            setEditIndex(null);

            setEditDraftImage(null);

          }}

          onSave={handleEditSave}

          onUpload={handleEditUpload}

        />

      )}



      <div className="hero-slides-editor space-y-2">

        {slides.map((slide, index) => {

          const suspended = Boolean(slide.suspended);

          return (

            <div

              key={slide.id}

              className={cn("content-editor-block", suspended && "hero-slide--suspended")}

            >

              <div className="content-editor-block-head">

                <p className="content-editor-block-label">

                  Slide {index + 1}

                  {suspended && <span className="hero-slide-badge">Suspendu</span>}

                </p>

                <div className="hero-slide-actions">

                  <button type="button" className="hero-slide-action" onClick={() => setPreviewIndex(index)}>

                    Voir

                  </button>

                  {canEdit && (

                    <>

                      <button type="button" className="hero-slide-action" onClick={() => openEdit(index)}>

                        Modifier

                      </button>

                      <button type="button" className="hero-slide-action" onClick={() => toggleSuspend(index)}>

                        {suspended ? "Réactiver" : "Suspendre"}

                      </button>

                      <button

                        type="button"

                        className="hero-slide-action hero-slide-action--danger"

                        onClick={() => removeSlide(index)}

                        disabled={slides.length <= 1}

                      >

                        Supprimer

                      </button>

                    </>

                  )}

                </div>

              </div>

            </div>

          );

        })}

        {canEdit && slides.length < 12 && (

          <button type="button" onClick={addSlide} className="content-editor-add-btn mt-1">

            + Ajouter slide

          </button>

        )}

      </div>

    </>

  );

}
