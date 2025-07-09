import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

const pastelColors = [
  'bg-purple-300',
  'bg-pink-400',
  'bg-yellow-300',
  'bg-green-300',
  'bg-blue-200',
  'bg-red-200',
  'bg-orange-200',
  'bg-cyan-200',
];

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', color: pastelColors[0], _id: null });
  const [loading, setLoading] = useState(false);

  const userData = JSON.parse(localStorage.getItem("synapto"));
  const token = userData?.token;

  const fetchNotes = async () => {
    try {
      const res = await axios.get('http://localhost:5050/api/notes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (form._id) {
        await axios.put(`http://localhost:5050/api/notes/${form._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('http://localhost:5050/api/notes', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ title: '', content: '', color: pastelColors[0], _id: null });
      fetchNotes();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note) => {
    setForm(note);
  };

  const toggleLike = async (id) => {
    try {
      const res = await axios.patch(`http://localhost:5050/api/notes/like/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedNotes = notes.map((n) =>
        n._id === id ? { ...n, liked: res.data.liked } : n
      );
      setNotes(updatedNotes);
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5050/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* 🔹 Fixed Header */}
      <div className="sticky top-0 z-10 bg-black p-6 shadow-md">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-1">📝 My Notes</h2>
          <p className="text-gray-400">Stay organized with your sticky notes</p>
        </div>
      </div>

      {/* 🔹 Scrollable Content (Form + Notes) */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-10">
        {/* Form */}
        <form
          onSubmit={handleSave}
          className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow space-y-4"
        >
          <input
            type="text"
            placeholder="Note Title"
            className="w-full p-3 rounded bg-white text-black placeholder:text-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Write your note..."
            rows={4}
            className="w-full p-3 rounded bg-white text-black placeholder:text-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          ></textarea>

          <div className="flex items-center gap-4">
            <label className="text-sm text-black">Pick color:</label>
            <select
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              className="rounded p-2 text-black bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {pastelColors.map((color, idx) => (
                <option key={idx} value={color}>
                  {color.replace('bg-', '')}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={loading}
              className="ml-auto bg-yellow-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
            >
              {form._id ? 'Update Note' : 'Add Note'}
            </button>
          </div>
        </form>

        {/* Notes Display */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note, idx) => (
            <div
              key={note._id}
              className={`rounded-xl shadow-lg p-4 text-black ${note.color || pastelColors[idx % pastelColors.length]}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{note.title}</h3>
                {note.liked ? (
                  <FaHeart
                    className="text-red-500 cursor-pointer"
                    onClick={() => toggleLike(note._id)}
                  />
                ) : (
                  <FaRegHeart
                    className="text-gray-600 cursor-pointer"
                    onClick={() => toggleLike(note._id)}
                  />
                )}
              </div>
              <p className="whitespace-pre-line">{note.content}</p>
              <div className="mt-4 text-sm text-gray-700 flex justify-between">
                <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(note)}
                    className="text-blue-800 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="text-red-800 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notes;