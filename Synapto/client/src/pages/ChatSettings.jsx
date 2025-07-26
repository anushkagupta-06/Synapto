import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Settings() {
  const token = localStorage.getItem("synapto_token");

  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", bio: "" });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data) {
          setCurrentUser(res.data);
          setFormData({ name: res.data.name, bio: res.data.bio || "" });
        } else {
          toast.error("Failed to load user details");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
        toast.error("Could not load profile");
      });
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return toast.error("Please select an image");
    const form = new FormData();
    form.append("image", selectedFile);

    try {
      setUploading(true);
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/user/profile-image`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Profile image updated!");
      setCurrentUser(res.data);
      setPreview(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload");
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/user/update-details`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile updated");
      setCurrentUser(res.data);
      setShowEditForm(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-6 font-sans">
      <h2 className="text-4xl font-bold text-[#58a6ff] text-center mb-10">
        Your Profile
      </h2>

      {currentUser && (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Sidebar Profile Card */}
          <div className="bg-[#161b22] p-6 rounded-xl border border-gray-700 shadow-lg text-center">
            <img
              src={
                preview ||
                currentUser.profileImage ||
                "https://www.w3schools.com/howto/img_avatar.png"
              }
              className="w-32 h-32 mx-auto rounded-full border-4 border-[#30363d] object-cover shadow-md"
              alt="Profile"
            />
            <h3 className="text-xl font-semibold mt-4">{currentUser.name}</h3>
            <p className="text-sm text-gray-400">{currentUser.email}</p>
            <p className="text-xs text-gray-500 mt-1">
              Joined on {new Date(currentUser.createdAt).toLocaleDateString()}
            </p>

            {/* Upload New Image */}
            <div className="mt-5">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file:bg-[#238636] file:text-white file:font-medium file:px-4 file:py-1 file:rounded-full file:border-0 file:cursor-pointer text-sm text-gray-400 w-full"
              />
              {preview && (
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="mt-3 w-full bg-[#238636] hover:bg-green-700 transition px-4 py-2 rounded-lg font-semibold"
                >
                  {uploading ? "Uploading..." : "Upload Image"}
                </button>
              )}
            </div>
          </div>

          {/* Main Details Section */}
          <div className="md:col-span-2 bg-[#161b22] p-6 rounded-xl border border-gray-700 shadow-lg">
            <div className="mb-6">
              <h4 className="text-lg font-bold mb-2">Bio</h4>
              <p className="text-gray-300 bg-[#0d1117] p-3 rounded-lg border border-gray-600">
                {currentUser.bio || "You haven't added a bio yet."}
              </p>
            </div>

            <button
              onClick={() => setShowEditForm(true)}
              className="bg-[#1f6feb] px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}

      {/* Modal for Editing */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0d1117]/80 backdrop-blur-xl border border-gray-600 p-8 rounded-2xl w-[90%] max-w-lg space-y-6 shadow-2xl animate-fadeIn">
            <h3 className="text-2xl font-bold text-[#58a6ff] text-center">
              Edit Your Profile
            </h3>

            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Your name"
              className="w-full p-3 rounded-md bg-[#161b22] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              placeholder="Write something about yourself..."
              className="w-full p-3 rounded-md bg-[#161b22] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows="4"
            />

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowEditForm(false)}
                className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleProfileUpdate}
                className="bg-[#238636] px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
