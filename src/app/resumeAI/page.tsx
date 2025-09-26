"use client";
import { useState } from "react";
import MarkdownViewer from "@/components/markDownViewer";
import axios from "axios";
import { ResumeForm } from "@/components/ResumeForm";
import { X } from "lucide-react";
import { toast } from "sonner";

export default function Resume() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState<{ file: boolean; role: boolean }>({
    file: false,
    role: false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({
      file: false,
      role: false,
    });
    if (!file || !role) {
      toast.warning("Check if all fields filled!");
      if (!file) setErrors((prev) => ({ ...prev, file: true }));
      if (!role) setErrors((prev) => ({ ...prev, role: true }));

      return;
    }

    setResult("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("role", role);

    const res = await axios.post("/api/resume", formData);

    setResult(res.data.error ? `Error: ${res.data.error}` : res.data.output);
  }
  return (
    <>
      <div className="flex my-15 mx-40">
        <div className="mx-auto justify-center">
          {result ? (
            <div style={{ marginTop: 20 }}>
              <button
                className="mb-5 bg-amber-700 p-2 cursor-pointer hover:bg-amber-800 rounded-xs"
                onClick={() => {
                  setResult("");
                }}
              >
                <X />
              </button>
              <MarkdownViewer content={result} />
            </div>
          ) : (
            <>
              <ResumeForm
                setFile={setFile}
                file={file}
                onSubmit={handleSubmit}
                setRole={setRole}
                role={role}
                errors={errors}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
