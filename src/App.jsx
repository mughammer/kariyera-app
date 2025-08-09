import React, { useState } from 'react';
// Import the functions you need from the Firebase SDKs you need
import { initializeApp } from "firebase/app";
// UPDATED: Import additional Firestore functions
import { getFirestore, collection, addDoc, connectFirestoreEmulator, initializeFirestore, memoryLocalCache } from "firebase/firestore";

// --- Firebase Configuration ---
// This is your actual firebaseConfig object from the Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyADVOzoPjRWNFQ9vJ4D7uEEL4frPUR4Pj8",
  authDomain: "kariyera-app.firebaseapp.com",
  projectId: "kariyera-app",
  storageBucket: "kariyera-app.firebasestorage.app",
  messagingSenderId: "923805417062",
  appId: "1:923805417062:web:13a3df912edee714c7b7a7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// UPDATED: Initialize Firestore with a memory cache for better emulator compatibility
const db = initializeFirestore(app, {
  localCache: memoryLocalCache()
});


// --- Connect to Local Emulator ---
// This checks if the app is running on localhost and connects to the local
// Firestore emulator if it is. Using '127.0.0.1' is often more reliable than 'localhost'.
if (window.location.hostname === "localhost") {
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
}


// --- Reusable Components ---

// A styled input field component
const InputField = ({ id, label, placeholder, value, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    <input
      type="text"
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
    />
  </div>
);

// A styled textarea component for larger text inputs
const TextAreaField = ({ id, label, placeholder, value, onChange, rows = 4 }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    <textarea
      id={id}
      name={id}
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
    />
  </div>
);

// A styled card component to group sections
const Card = ({ title, children }) => (
  <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
    <div className="p-6">
      <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">{title}</h2>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  </div>
);

// --- Main App Component ---

function App() {
  // State to hold all the form data
  const [formData, setFormData] = useState({
    situation: '',
    task: '',
    action: '',
    result: '',
    skills: '',
    coreValues: '',
    passions: '',
    anecdotes: '',
    tone: 'Formal',
  });

  // A single handler function to update the state for any input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handler for the main form submission, now with Firebase integration
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add a new document with a generated ID to the "starStories" collection
      const docRef = await addDoc(collection(db, "starStories"), formData);
      console.log("Document written with ID: ", docRef.id);
      alert("Successfully saved to local emulator database!");
      // Optional: Clear the form after successful submission
      setFormData({
        situation: '', task: '', action: '', result: '', skills: '',
        coreValues: '', passions: '', anecdotes: '', tone: 'Formal',
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error saving to database. Check the console (F12) for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">AI Career Assistant</h1>
          <p className="mt-4 text-lg text-gray-400">Your personal content engine for job applications.</p>
        </header>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* STAR Method Card */}
          <Card title="STAR Story Database">
            <p className="text-sm text-gray-400 -mt-2 mb-4">Add a professional experience using the STAR method.</p>
            <TextAreaField id="situation" name="situation" label="Situation" placeholder="Describe the context. Where and when did this take place?" value={formData.situation} onChange={handleInputChange} />
            <TextAreaField id="task" name="task" label="Task" placeholder="What was your specific goal or responsibility?" value={formData.task} onChange={handleInputChange} />
            <TextAreaField id="action" name="action" label="Action" placeholder="What specific steps did YOU take to address the task?" value={formData.action} onChange={handleInputChange} />
            <TextAreaField id="result" name="result" label="Result" placeholder="What was the outcome? Use numbers and data where possible." value={formData.result} onChange={handleInputChange} />
            <InputField id="skills" name="skills" label="Skill Tags" placeholder="e.g., Python, Project Management, Team Leadership (comma-separated)" value={formData.skills} onChange={handleInputChange} />
          </Card>

          {/* Personality Module Card */}
          <Card title="Personality Module">
            <TextAreaField id="coreValues" name="coreValues" label="My Core Values" placeholder="What principles guide you? (e.g., Integrity, Continuous Learning)" value={formData.coreValues} onChange={handleInputChange} />
            <TextAreaField id="passions" name="passions" label="My Passions" placeholder="What are you genuinely excited about, inside or outside of work?" value={formData.passions} onChange={handleInputChange} />
            <TextAreaField id="anecdotes" name="anecdotes" label="Defining Anecdotes" placeholder="Short stories that reveal your character or work ethic." value={formData.anecdotes} onChange={handleInputChange} />
          </Card>

          {/* AI Configuration Card */}
          <Card title="AI Configuration">
            <div>
              <label htmlFor="tone" className="block text-sm font-medium text-gray-300 mb-1">
                Writing Tone
              </label>
              <select
                id="tone"
                name="tone"
                value={formData.tone}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
              >
                <option>Formal</option>
                <option>Conversational</option>
                <option>Bold</option>
                <option>Enthusiastic</option>
              </select>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Save to Database
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default App;
