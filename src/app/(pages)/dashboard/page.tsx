"use client";
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
  userId: string;
  name: string;
  email: string;
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

  if (loading) {
    return <div>Loading...</div>; // You can customize the loading state
  }

  return (
    <div>
      <Link href={"/"} className="absolute top-10 right-10 hover:underline">Home</Link>
      <div className="max-w-7xl mx-auto md:p-5 p-3 md:mt-16 mt-8">
        <div className="flex items-center justify-center md:mb-8 mb-5">
          <h2 className="text-center font-medium md:text-4xl text-2xl text-zinc-200">Dashboard</h2>
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
          {/* Loop through clientsData to render each client */}
          {clientsData.map((data) => (
            <div key={data.id} className="w-full md:p-7 p-4 border-zinc-300 border rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-300">Date: {data.createdAt?.toDate().toLocaleDateString()}</p>
                <button onClick={() => handleDelete(data)} className="bg-zinc-100 p-2 text-red-500 rounded-full cursor-pointer hover:bg-red-500 hover:text-white transition-all duration-500">
                  <GoTrash />
                </button>
              </div>

              <p className="text-sm text-zinc-300 mt-4">User ID:
                <span className="text-[16px] font-medium text-zinc-200 md:pl-1">{data.userId}</span>
              </p>
              <p className="text-sm mt-5 text-zinc-300">Name:
                <span className="text-[16px] font-medium text-zinc-200 md:pl-1">{data.name}</span>
              </p>

              <Link href={`mailto:${data.email}`} className="text-sm text-zinc-300 block mt-5">
                E-Mail:
                <span className="text-[16px] font-medium text-zinc-200 md:pl-1 hover:underline">{data.email}</span>
              </Link>

              <Image src={data.fileUrl} alt="User Image" className="mx-auto w-auto h-80 mt-5 rounded-lg" width={500} height={200} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
