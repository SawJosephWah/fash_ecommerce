import  { useEffect, useState, type ChangeEvent } from "react";
import { X, UploadCloud } from "lucide-react";

interface ImageUploadProps {
  onChange: (files: File[]) => void;
  defaultImages?: string[];
}

const MultiImageUpload = ({ onChange, defaultImages = [] }: ImageUploadProps) => {
  const [previews, setPreviews] = useState<string[]>(defaultImages);

  // Inside MultiImageUpload.tsx
  useEffect(() => {
    if (!defaultImages || defaultImages.length === 0) {
      setPreviews([]);
      return;
    }

    const urls = defaultImages.map((img: any) => {
      if (img instanceof File) {
        return URL.createObjectURL(img);
      }
      if (typeof img === "object" && img.url) {
        return img.url; // Use the Cloudinary URL from your API
      }
      if (typeof img === "string") {
        return img;
      }
      return "";
    });

    setPreviews(urls);

    return () => {
      urls.forEach(url => {
        if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [defaultImages]);


  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Merge new files with existing ones
    onChange([...(defaultImages as any[]), ...files]);
  };

  const removeImage = (index: number) => {
    const updated = (defaultImages as any[]).filter((_, i) => i !== index);
    onChange(updated);
  };


  return (
    <div className="space-y-4 w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {previews.map((url, index) => (
          <div key={index} className="relative group aspect-square border rounded-lg overflow-hidden bg-zinc-50">
            <img src={url} alt="preview" className="object-cover w-full h-full" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-zinc-200 rounded-lg cursor-pointer hover:bg-zinc-50 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-8 h-8 text-zinc-400 mb-2" />
            <p className="text-[10px] uppercase font-bold text-zinc-500">Upload</p>
          </div>
          <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
        </label>
      </div>
    </div>
  );
};

export default MultiImageUpload;