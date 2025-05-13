"use client";
import Loader from '@/components/Loader';
import { db } from '@/libs/firebase';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { GoTrash } from 'react-icons/go';
import { toast } from 'react-toastify';

// Define the type for the client data
interface Client {
  id: string;
  date: string;
  name: string;
  message: string;
  fileUrl: string;
  createdAt?: {
    toDate: () => Date;
  };
}

const Page = () => {
  const [clientsData, setClientsData] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "data"));
        const fetchedClientsData: Client[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Client[];

        setClientsData(fetchedClientsData);
      } catch (error) {
        console.error("Error fetching clients data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleDelete = async (userData: { id: string, name: string }) => {
    const confirmDelete = confirm("Are you sure you want to delete this client?");
    if (!confirmDelete) return;

    try {
      const user_Data = userData.id;
      await deleteDoc(doc(db, "data", user_Data));
      setClientsData(prev => prev.filter(data => data.id !== user_Data));
      toast.success(`${userData.name} deleted successfully!`);

    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  // Utility function to determine the file type
  const getFileType = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (!extension) return 'unknown';

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
    if (['mp4', 'webm', 'ogg'].includes(extension)) return 'video';
    if (['zip', 'rar', '7z'].includes(extension)) return 'archive';

    return 'other';
  };


  if (loading) {
    return <Loader />; // You can customize the loading state
  }

  return (
    <div>
      <Link href={"/"} className="absolute md:top-10 top-4 md:left-10 left-4 hover:underline">Home</Link>
      <div className="max-w-7xl mx-auto md:p-5 p-3 md:mt-16 mt-8">
        <div className="flex items-center justify-center md:mb-8 mb-5">
          <h2 className="text-center font-medium md:text-4xl text-2xl text-zinc-200">Dashboard</h2>
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
          {/* Loop through clientsData to render each client */}
          {clientsData.map((data) => {
            const fileType = getFileType(data.fileUrl);

            return (
              <div key={data.id} className="w-full md:p-7 p-4 border-zinc-300 border rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-zinc-300">
                    Date: {data.createdAt?.toDate().toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleDelete(data)}
                    className="bg-zinc-100 p-2 text-red-500 rounded-full cursor-pointer hover:bg-red-500 hover:text-white transition-all duration-500"
                  >
                    <GoTrash />
                  </button>
                </div>

                <p className="text-sm mt-5 text-zinc-300">
                  Name:
                  <span className="text-[16px] font-medium text-zinc-200 md:pl-1">{data.name}</span>
                </p>

                <p className="text-sm text-zinc-300 block mt-5">
                  Message
                </p>
                <textarea value={data.message}
                  className="w-full border border-zinc-700 p-3 rounded-lg mt-2" readOnly placeholder="Message" rows={3} id="message" />

                {/* Dynamic media rendering based on file type */}
                <div className="mt-5 w-full text-center">
                  {fileType === 'image' && (
                    <Image
                      src={data.fileUrl}
                      alt="Uploaded Image"
                      className="mx-auto w-auto h-80 rounded-lg"
                      width={500}
                      height={200}
                    />
                  )}

                  {fileType === 'video' && (
                    <video controls className="mx-auto w-full h-80 rounded-lg">
                      <source src={data.fileUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}

                  {fileType === 'archive' && (
                    <a
                      href={data.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-200 bg-zinc-700 p-4 mt-3 block rounded-lg w-full hover:underline"
                    >
                      📦 Download ZIP File
                    </a>
                  )}

                  {fileType === 'other' && (
                    <a
                      href={data.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onError={() => {
                        toast.error("File could not be found or loaded.");
                      }}
                      className="text-zinc-200 bg-zinc-700 p-4 mt-3 block rounded-lg w-full hover:underline"
                    >
                      📁 Open File
                    </a>
                  )}
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
};

export default Page;
