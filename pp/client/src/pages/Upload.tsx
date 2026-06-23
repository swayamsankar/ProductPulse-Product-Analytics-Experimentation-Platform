import { PageHeader } from "@/components/PageHeader";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  FileText,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";
import { useTitle } from "@/lib/use-title";

export default function UploadPage() {
  useTitle("Data Upload — ProductPulse");

  const inputRef = useRef<HTMLInputElement>(null);

  const [drag, setDrag] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  // Load upload history from backend
  const loadHistory = async () => {
    try {
      const token = localStorage.getItem("pp_token");

      const response = await fetch(
        "http://localhost:5000/api/upload/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setItems(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  async function handleFiles(files: FileList | null) {
    if (!files || !files.length) return;

    const file = files[0];

    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("Only CSV files are supported");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("pp_token");

      const response = await fetch(
        "http://localhost:5000/api/upload/csv",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      toast.success(
        `${file.name} uploaded successfully (${data.inserted} rows)`
      );

      // Reload history from backend
      await loadHistory();

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Data Upload"
        description="Upload CSV event datasets to power analytics"
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`rounded-xl border-2 border-dashed p-8 sm:p-10 text-center transition-colors ${
          drag
            ? "border-primary bg-primary/5"
            : "border-border bg-card"
        }`}
      >
        <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 text-primary grid place-items-center">
          <UploadCloud className="h-6 w-6" />
        </div>

        <div className="mt-3 font-semibold text-lg">
          Drop a CSV here
        </div>

        <div className="text-sm text-muted-foreground">
          or click to browse — max 50MB
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <Button
          className="mt-5"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Uploading..." : "Choose File"}
        </Button>

        <div className="mt-3 text-xs text-muted-foreground">
          Expected columns:
          <br />
          user_id, event, timestamp, properties
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-card overflow-x-auto">
        <div className="px-5 py-3 border-b flex items-center justify-between">
          <div className="font-semibold">
            Upload History
          </div>

          <div className="text-xs text-muted-foreground">
            {items.length} files
          </div>
        </div>

        <table className="min-w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="text-left px-5 py-3">
                File
              </th>

              <th className="text-left px-5 py-3">
                Uploaded
              </th>

              <th className="text-right px-5 py-3">
                Rows
              </th>

              <th className="text-left px-5 py-3">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((u) => (
              <tr
                key={u._id || u.id}
                className="border-t"
              >
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {u.fileName}
                  </span>
                </td>

                <td className="px-5 py-3">
                  {new Date(
                    u.createdAt
                  ).toLocaleDateString()}
                </td>

                <td className="px-5 py-3 text-right">
                  {Number(
                    u.rows || 0
                  ).toLocaleString()}
                </td>

                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                    <CheckCircle2 className="h-3 w-3" />
                    Processed
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No uploads yet
          </div>
        )}
      </div>
    </>
  );
}