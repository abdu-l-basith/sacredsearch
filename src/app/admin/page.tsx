"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

// Define Team type
type Team = {
  id: string;
  name: string;
  username: string;
  password: string;
  score: number;
};

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeam, setNewTeam] = useState({ name: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);

  // --- Fetch teams in real-time ---
  useEffect(() => {
    if (!loggedIn) return;

    const unsub = onSnapshot(collection(db, "teams"), (snapshot) => {
      const teamData: Team[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "",
          username: data.username || "",
          password: data.password || "",
          score: data.score || 0,
        };
      });
      setTeams(teamData);
    });

    return () => unsub();
  }, [loggedIn]);

  // --- Login ---
  const handleLogin = () => {
    if (password === "muslih") setLoggedIn(true);
    else alert("Incorrect password");
  };

  // --- Add Team ---
  const handleAddTeam = async () => {
    if (!newTeam.name || !newTeam.username || !newTeam.password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "teams"), {
        name: newTeam.name,
        username: newTeam.username,
        password: newTeam.password,
        score: 0,
      });
      setNewTeam({ name: "", username: "", password: "" });
    } catch (e) {
      console.error("Error adding team:", e);
      alert("Error adding team. Check console.");
    }
    setLoading(false);
  };

  // --- Delete Team ---
  const handleDeleteTeam = async (id: string) => {
    if (confirm("Are you sure you want to delete this team?")) {
      try {
        await deleteDoc(doc(db, "teams", id));
      } catch (e) {
        console.error("Error deleting team:", e);
        alert("Error deleting team. Check console.");
      }
    }
  };

  // --- Clear All Teams ---
  const handleClearProgram = async () => {
    if (!confirm("⚠️ Are you sure you want to CLEAR ALL DATA? This cannot be undone!")) return;

    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "teams"));
      const deletions = querySnapshot.docs.map((d) => deleteDoc(doc(db, "teams", d.id)));
      await Promise.all(deletions);
      alert("All team data cleared successfully.");
    } catch (e) {
      console.error("Error clearing data:", e);
      alert("Error clearing data. Check console.");
    }
    setLoading(false);
  };

  // --- Render Login Page ---
  if (!loggedIn) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-80 text-center">
          <h2 className="text-xl mb-4 font-semibold">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter password"
            className="w-full p-2 mb-3 rounded bg-gray-700 text-white focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // --- Render Admin Dashboard ---
  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Clear Program Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleClearProgram}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold"
          disabled={loading}
        >
          {loading ? "Clearing..." : "🧨 Clear Program"}
        </button>
      </div>

      {/* Add New Team Form */}
      <div className="max-w-md mx-auto bg-gray-900 p-4 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-3">Add New Team</h2>
        <input
          placeholder="Team Name"
          className="w-full mb-2 p-2 rounded bg-gray-800 text-white"
          value={newTeam.name}
          onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
        />
        <input
          placeholder="Username"
          className="w-full mb-2 p-2 rounded bg-gray-800 text-white"
          value={newTeam.username}
          onChange={(e) => setNewTeam({ ...newTeam, username: e.target.value })}
        />
        <input
          placeholder="Password"
          className="w-full mb-3 p-2 rounded bg-gray-800 text-white"
          value={newTeam.password}
          onChange={(e) => setNewTeam({ ...newTeam, password: e.target.value })}
        />
        <button
          onClick={handleAddTeam}
          className="w-full bg-green-600 hover:bg-green-700 p-2 rounded font-semibold"
          disabled={loading}
        >
          {loading ? "Adding..." : "➕ Add Team"}
        </button>
      </div>

      {/* Teams List */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-3">Teams</h2>
        {teams.length === 0 ? (
          <p className="text-gray-400 text-center">No teams found</p>
        ) : (
          <div className="space-y-2">
            {teams.map((team) => (
              <div
                key={team.id}
                className="bg-gray-800 p-3 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-bold">{team.name}</p>
                  <p className="text-sm text-gray-400">
                    {team.username} / {team.password}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteTeam(team.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
