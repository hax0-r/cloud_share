"use client"

import { db } from "@/libs/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

export default function Home() {
  const [name, setName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !message || !file) {
      toast.error("All fields are required.");
      return;
    }

    setLoading(true);

    let uploadedFileUrl = "";

    try {
      // Upload to Cloudinary
      const url = `https://api.cloudinary.com/v1_1/deo5ex1zo/upload`;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "deo5ex1zo"); // 🔁 Make sure this matches your actual unsigned preset name

      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        uploadedFileUrl = data.secure_url;
      } else {
        throw new Error("Failed to upload file to Cloudinary.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("File upload failed.");
      setLoading(false);
      return;
    }

    try {
      // Save to Firestore
      await addDoc(collection(db, "data"), {
        name,
        message,
        fileUrl: uploadedFileUrl,
        createdAt: serverTimestamp(),
      });

      toast.success("Submitted successfully!");
      setName("");
      setMessage("");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Manually reset the file input
      }
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      toast.error("Submission failed.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="">
      <Link href={"/dashboard"} className="absolute top-10 left-10 hover:underline">Dashboard</Link>
      <div className="max-w-5xl w-full mx-auto p-5">
        <h1 className="text-4xl font-medium md:mt-16 mt-10">Cloud Project</h1>

        <form className="mt-12" onSubmit={formHandler}>
          {/* Name Input */}
          <label htmlFor="name" className="text-zinc-300">Name</label>
          <input onChange={(e) => setName(e.target.value)}
            value={name} className="w-full border border-zinc-700 p-3 rounded-lg mt-1" placeholder="Write your work" id="message" />

          <label htmlFor="name" className="text-zinc-300 block mt-6">Message</label>
          <textarea onChange={(e) => setMessage(e.target.value)}
            value={message} className="w-full border border-zinc-700 p-3 rounded-lg mt-1" placeholder="Message" rows={3} id="message"></textarea>

        
          {/* File Upload */}
          <label htmlFor="file" className="text-zinc-300 block mt-6">Upload File</label>

          <div
            className={`relative mt-1 text-zinc-300 font-semibold text-base rounded w-full h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-dashed ${file ? "border-green-600 bg-green-900/10" : "border-zinc-700"
              } transition-all duration-300`}
            onClick={() => fileInputRef.current?.click()}
          >
            {file ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 mb-2 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.285 6.708l-11.285 11.285-5.285-5.285 1.414-1.414 3.871 3.871 9.871-9.871z" />
                </svg>
                <p className="text-sm font-medium text-green-400">File Attached!</p>
                <p className="text-xs mt-1 text-zinc-200">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-11 mb-3 fill-gray-500" viewBox="0 0 32 32">
                  <path d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z" />
                  <path d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z" />
                </svg>
                <p>Click or drop to upload</p>
                <p className="text-xs font-medium text-zinc-400 mt-1">Max file size 10MB.</p>
              </>
            )}

            <input
              onChange={(e) => {
                const selected = e.target.files?.[0];
                if (selected) setFile(selected);
              }}
              type="file"
              id="file"
              ref={fileInputRef}
              className="hidden"
            />
          </div>



          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-center mt-4 rounded-lg bg-zinc-200 cursor-pointer transition-all duration-500 hover:opacity-80 text-black flex items-center justify-center gap-2 p-3"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Submitting...
              </div>
            ) : (
              "Submit the Request"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
