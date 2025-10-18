"use client";

import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [mark, setMark] = useState(0);
  const [loading, setLoading] = useState(true);

  // Get userId from localStorage
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  // Redirect to login if no userId
  useEffect(() => {
    if (!userId) {
      router.push("/manager/login");
    }
  }, [userId, router]);

  // Fetch mark
  useEffect(() => {
    if (!userId) return;

    const fetchMark = async () => {
      const docRef = doc(db, "teams", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setMark(docSnap.data().mark || 0);
      } else {
        console.log("Document not found!");
      }
      setLoading(false);
    };

    fetchMark();
  }, [userId]);

  const changeMark = async (value) => {
    if (!userId) return;

    const docRef = doc(db, "teams", userId);
    const newMark = mark + value;
    await updateDoc(docRef, { mark: newMark });
    setMark(newMark);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Total Mark: {mark}</h1>
      <button
        onClick={() => changeMark(1)}
        className="bg-green-500 text-white text-xl px-10 py-4 rounded-lg mb-4 hover:bg-green-600 w-full max-w-xs"
      >
        Add Mark
      </button>
      <button
        onClick={() => changeMark(-1)}
        className="bg-red-500 text-white text-lg px-8 py-3 rounded hover:bg-red-600 w-full max-w-xs"
      >
        Decrease Mark
      </button>
    </div>
  );
}
