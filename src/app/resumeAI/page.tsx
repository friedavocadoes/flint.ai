"use client";
import { useState } from "react";
// import MarkdownPreview from "@uiw/react-markdown-preview";
import MarkdownViewer from "@/components/markDownViewer";
import axios from "axios";
import { ResumeForm } from "@/components/ResumeForm";
import { X } from "lucide-react";

export default function Resume() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState("");
  const [role, setRole] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setResult("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("role", role);

    const res = await axios.post("/api/resume", formData);

    setResult(res.data.error ? `Error: ${res.data.error}` : res.data.output);
  }
  return (
    <>
      <div className="flex my-20 mx-40">
        <div className="mx-auto justify-center">
          <h1 className="font-extrabold text-center text-4xl mb-10">
            Resume AI
          </h1>
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
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
