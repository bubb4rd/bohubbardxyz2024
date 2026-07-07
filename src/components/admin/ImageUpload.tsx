"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ImageUploadProps = {
  name: string;
  defaultValue?: string;
  label?: string;
  accept?: string;
};

export function ImageUpload({
  name,
  defaultValue = "",
  label = "Image URL",
  accept = "image/*,.pdf",
}: ImageUploadProps) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);

    const supabase = createClient();
    const ext = file.name.split(".").pop() ?? "bin";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio-assets")
      .upload(path, file, { upsert: false });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("portfolio-assets").getPublicUrl(path);
    setUrl(data.publicUrl);
    setUploading(false);
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-200">{label}</label>
      <input type="hidden" name={name} value={url} />
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://..."
        className="admin-input w-full"
      />
      <div className="flex items-center gap-3">
        <label className="admin-button-secondary cursor-pointer">
          {uploading ? "Uploading..." : "Upload file"}
          <input
            type="file"
            accept={accept}
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleUpload(file);
            }}
          />
        </label>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-sky-400 hover:underline"
          >
            Preview
          </a>
        ) : null}
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
