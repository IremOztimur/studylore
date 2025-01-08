"use client";

import { useState, useEffect } from 'react';

interface Note {
  id: string;
  text: string;
  color: string;
}

const COLORS = [
  'bg-blue-100/80 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800',
  'bg-emerald-100/80 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800',
  'bg-amber-100/80 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-800',
  'bg-violet-100/80 dark:bg-violet-900/50 border border-violet-200 dark:border-violet-800',
];

export default function QuickNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('userNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userNotes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        text: newNote.trim(),
        color: COLORS[notes.length % COLORS.length],
      };
      setNotes(prev => [...prev, note]);
      setNewNote('');
    }
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  return (
    <aside className="w-full lg:w-1/3 bg-white/80 dark:bg-gray-900/90 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-semibold mb-4">Your Notes</h2>
      
      {/* Note input form */}
      <form onSubmit={addNote} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a new note..."
            className="flex-1 p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white/90 dark:bg-gray-800/90 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 shadow-sm"
          >
            Add
          </button>
        </div>
      </form>

      {/* Notes list */}
      <ul className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
        {notes.map((note) => (
          <li
            key={note.id}
            className={`${note.color} p-3 rounded-lg flex justify-between items-start group`}
          >
            <span className="flex-1">{note.text}</span>
            <button
              onClick={() => deleteNote(note.id)}
              className="opacity-0 group-hover:opacity-100 ml-2 text-gray-500 hover:text-red-500 transition-opacity"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      {notes.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center mt-4">
          No notes yet. Add your first note above!
        </p>
      )}
    </aside>
  );
}

