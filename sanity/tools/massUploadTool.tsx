import React, { useState, useEffect, useRef, useCallback } from "react";
import { useClient } from "sanity";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Loader2, UploadCloud, AlertTriangle, Trash2, Images, RefreshCw, CheckCircle2 } from "lucide-react";

interface GalleryImage {
  _id: string;
  title: string;
  referenceId?: string;
  imageUrl?: string;
}

interface ProgressState {
  current: number;
  total: number;
  label: string;
  done: boolean;
  isDelete: boolean;
}

export function MassUploadTool() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [categories, setCategories] = useState<{ _id: string; title: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [deleteCategory, setDeleteCategory] = useState<string>("");
  const [browseCategory, setBrowseCategory] = useState<string>("");
  const [isBusy, setIsBusy] = useState(false);
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    client.fetch(`*[_type == "category" && isAggregated != true]{_id, title} | order(title asc)`).then((data) => {
      setCategories(data);
      if (data.length > 0) setSelectedCategory(data[0]._id);
    });
  }, [client]);

  const fetchImages = useCallback(async (categoryId: string) => {
    if (!categoryId) { setImages([]); return; }
    setIsLoadingImages(true);
    const data = await client.fetch<GalleryImage[]>(
      `*[_type == "galleryImage" && category._ref == $categoryId] | order(title asc) {
        _id, title, referenceId, "imageUrl": image.asset->url
      }`,
      { categoryId }
    );
    setImages(data);
    setIsLoadingImages(false);
  }, [client]);

  useEffect(() => {
    fetchImages(browseCategory);
  }, [browseCategory, fetchImages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!selectedCategory) { alert("Välj en kategori först!"); return; }

    setIsBusy(true);
    setProgress({ current: 0, total: files.length, label: "Förbereder...", done: false, isDelete: false });
    let uploadedCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress({ current: i, total: files.length, label: `Laddar upp: ${file.name}`, done: false, isDelete: false });
      try {
        const asset = await client.assets.upload("image", file, { filename: file.name });
        const rawTitle = file.name.split(".").slice(0, -1).join(".") || "Otitulerad bild";
        const title = rawTitle.replace(/[-_]/g, " ");
        const slugBase = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
        const slug = slugBase + "-" + Math.random().toString(36).substring(2, 8);
        await client.create({
          _type: "galleryImage", title, referenceId: rawTitle,
          slug: { _type: "slug", current: slug },
          image: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
          category: { _type: "reference", _ref: selectedCategory },
        });
        uploadedCount++;
      } catch (error) {
        console.error("Fel vid uppladdning av", file.name, error);
      }
    }

    setProgress({ current: files.length, total: files.length, label: `Klar! ${uploadedCount} av ${files.length} bilder uppladdade.`, done: true, isDelete: false });
    setIsBusy(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (browseCategory === selectedCategory) fetchImages(browseCategory);
  };

  const handleDeleteOne = async (img: GalleryImage) => {
    if (!window.confirm(`Radera "${img.title}"? Detta kan inte ångras.`)) return;
    setDeletingId(img._id);
    await client.delete(img._id);
    setImages((prev) => prev.filter((i) => i._id !== img._id));
    setDeletingId(null);
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategory) { alert("Välj en kategori att radera från!"); return; }
    const catName = categories.find((c) => c._id === deleteCategory)?.title;
    if (!window.confirm(`ÄR DU HELT SÄKER? Detta raderar ALLA fotografier i kategorin "${catName}"! (Kategorin sparas, men alla bilder försvinner)`)) return;
    if (!window.confirm(`Sista varningen: Klicka OK för att radera ALLA bilder i "${catName}" nu.`)) return;

    setIsBusy(true);
    setProgress({ current: 0, total: 0, label: "Hämtar bilder...", done: false, isDelete: true });

    try {
      const imagesToDelete = await client.fetch<{ _id: string }[]>(
        `*[_type == "galleryImage" && category._ref == $categoryId]{_id}`,
        { categoryId: deleteCategory }
      );
      const total = imagesToDelete.length;
      setProgress({ current: 0, total, label: `Raderar 0 av ${total}...`, done: false, isDelete: true });

      for (let i = 0; i < imagesToDelete.length; i++) {
        setProgress({ current: i + 1, total, label: `Raderar ${i + 1} av ${total}...`, done: false, isDelete: true });
        await client.delete(imagesToDelete[i]._id);
      }

      setProgress({ current: total, total, label: `Klart! ${total} bilder raderades från "${catName}".`, done: true, isDelete: true });
      if (browseCategory === deleteCategory) setImages([]);
    } catch (error) {
      console.error("Fel vid radering:", error);
      alert("Ett fel uppstod vid radering. Kontrollera konsolen.");
      setProgress(null);
    }

    setIsBusy(false);
    setDeleteCategory("");
  };

  const progressPercent = progress && progress.total > 0
    ? Math.round((progress.current / progress.total) * 100)
    : progress?.done ? 100 : 0;

  return (
    <div className="mx-auto h-full max-w-4xl overflow-y-auto p-8 font-sans space-y-6">

      {/* ── Progress overlay ── */}
      {progress && (
        <Card className={`border shadow-md ${progress.isDelete ? "border-destructive/30 bg-red-500/5 dark:bg-red-500/10" : "border-primary/30 bg-primary/5"}`}>
          <CardContent className="pt-5 pb-5 space-y-3">
            <div className="flex items-center gap-2">
              {progress.done
                ? <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                : <Loader2 className={`h-5 w-5 animate-spin shrink-0 ${progress.isDelete ? "text-destructive" : "text-primary"}`} />
              }
              <p className="font-medium text-sm text-foreground">{progress.label}</p>
            </div>
            <Progress
              value={progressPercent}
              className={`h-2 ${progress.isDelete ? "[&>div]:bg-destructive" : ""}`}
            />
            {progress.total > 0 && (
              <p className="text-xs text-muted-foreground text-right">
                {progress.current} / {progress.total} ({progressPercent}%)
              </p>
            )}
            {progress.done && (
              <Button variant="ghost" size="sm" className="w-full mt-1" onClick={() => setProgress(null)}>
                Stäng
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Upload ── */}
      <Card className="border-muted shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <UploadCloud className="text-primary h-6 w-6" />
            Ladda upp bilder
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-2 text-base">
            Dra in eller markera flera bilder samtidigt. Ett &quot;Fotografi&quot;-dokument skapas automatiskt
            för varje bild med rätt kategori och Reference ID.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-foreground text-sm font-semibold">
              1. Vilken kategori ska bilderna tillhöra?
            </label>
            <Select disabled={isBusy} value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="-- Välj kategori --" />
              </SelectTrigger>
              <SelectContent className="z-[100000]">
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>{cat.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-foreground text-sm font-semibold">
              2. Välj bilderna (fungerar även att dra in dem i rutan)
            </label>
            <div className={`relative flex items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
              isBusy || !selectedCategory
                ? "bg-muted border-muted-foreground/30 cursor-not-allowed"
                : "bg-card hover:bg-accent hover:text-accent-foreground border-primary/40 hover:border-primary/80 cursor-pointer"
            }`}>
              <input
                type="file" multiple accept="image/*"
                onChange={handleUpload} ref={fileInputRef}
                disabled={isBusy || !selectedCategory}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
              />
              <div className="pointer-events-none text-center">
                <UploadCloud className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <p className="text-foreground font-medium">Klicka eller dra bilder hit</p>
                <p className="text-muted-foreground mt-1 text-sm">Stöder JPG, PNG, WEBP</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Browse & delete individual images ── */}
      <Card className="border-muted shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <Images className="text-primary h-5 w-5" />
            Hantera bilder
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Välj en kategori för att se och radera enskilda bilder.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3 items-center flex-wrap">
            <Select value={browseCategory} onValueChange={setBrowseCategory}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="-- Välj kategori --" />
              </SelectTrigger>
              <SelectContent className="z-[100000]">
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>{cat.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {browseCategory && (
              <Button variant="outline" size="sm" onClick={() => fetchImages(browseCategory)} disabled={isLoadingImages} className="gap-2">
                <RefreshCw className={`h-4 w-4 ${isLoadingImages ? "animate-spin" : ""}`} />
                Uppdatera
              </Button>
            )}
            {browseCategory && !isLoadingImages && (
              <span className="text-muted-foreground text-sm">{images.length} bilder</span>
            )}
          </div>

          {isLoadingImages && (
            <div className="flex justify-center py-10">
              <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
            </div>
          )}

          {!isLoadingImages && browseCategory && images.length === 0 && (
            <p className="text-muted-foreground py-8 text-center text-sm">Inga bilder i denna kategori.</p>
          )}

          {!isLoadingImages && images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((img) => (
                <div key={img._id} className="group relative rounded-lg overflow-hidden border border-muted bg-muted aspect-square">
                  {img.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`${img.imageUrl}?w=300&h=300&fit=crop&auto=format`}
                      alt={img.title}
                      className="h-full w-full object-cover transition-opacity group-hover:opacity-60"
                    />
                  )}
                  <div className="absolute inset-0 flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-medium truncate drop-shadow-md mb-1">{img.title}</p>
                    <Button
                      variant="destructive" size="sm"
                      className="w-full gap-1 text-xs h-7"
                      onClick={() => handleDeleteOne(img)}
                      disabled={deletingId === img._id}
                    >
                      {deletingId === img._id
                        ? <Loader2 className="h-3 w-3 animate-spin" />
                        : <Trash2 className="h-3 w-3" />}
                      Radera
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Danger zone ── */}
      <div className="rounded-lg border border-destructive/20 bg-red-500/5 px-6 pt-6 pb-6 dark:bg-red-500/10">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-destructive mt-0.5 h-5 w-5 shrink-0" />
          <div className="space-y-4 w-full">
            <h3 className="text-destructive text-lg font-semibold">Farlig Zon</h3>
            <p className="text-muted-foreground text-sm">
              Välj en kategori nedan för att <b>radera ALLA fotografier i den kategorin</b> på en gång.
              Detta kan <b>inte</b> ångras. Kategorin i sig sparas.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="w-full sm:w-1/2">
                <Select disabled={isBusy} value={deleteCategory} onValueChange={setDeleteCategory}>
                  <SelectTrigger className="w-full bg-background border-destructive/30 hover:border-destructive/60">
                    <SelectValue placeholder="-- Välj kategori att tömma --" />
                  </SelectTrigger>
                  <SelectContent className="z-[100000]">
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>{cat.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="destructive"
                onClick={handleDeleteCategory}
                disabled={isBusy || !deleteCategory}
                className="w-full sm:w-auto"
              >
                Radera alla bilder i kategorin
              </Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
