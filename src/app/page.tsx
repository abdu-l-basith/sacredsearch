"use client";

import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, onSnapshot, DocumentData } from "firebase/firestore";

// Define Firestore document type
type TeamDoc = {
  teamName?: string;
  username?: string;
  mark?: number;
};

// Define Team type for state
type Team = {
  id: string;
  name: string;
  score: number;
};

export default function Scoreboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "teams"),
      (snapshot) => {
        const teamsData: Team[] = snapshot.docs.map((doc) => {
          const data = doc.data() as TeamDoc; // Type assertion
          return {
            id: doc.id,
            name: data.teamName || data.username || "Unknown",
            score: data.mark || 0,
          };
        });

        // Sort descending by score
        teamsData.sort((a, b) => b.score - a.score);
        setTeams(teamsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching teams:", error);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  if (loading) return <p className="text-center mt-10 text-xl">Loading scoreboard...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-900">🏆 Scoreboard</h1>
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team, index) => (
          <div
            key={team.id}
            className="bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center justify-center transition transform hover:scale-105"
          >
            <span className="text-lg font-medium text-gray-500 mb-2">#{index + 1}</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">{team.name}</h2>
            <span className="text-4xl sm:text-5xl font-extrabold text-blue-600">{team.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
