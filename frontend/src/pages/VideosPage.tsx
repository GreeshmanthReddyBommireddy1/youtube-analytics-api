import { useEffect, useMemo, useState } from "react";
import {
  getAllVideos,
  createVideo,
  updateVideo,
  deleteVideo,
} from "../services/videoService";

import type { Video } from "../types/models";

type UserRole = "admin" | "creator" | "viewer";

interface VideoFormData {
  channel_id: number;
  genre_id: number;
  title: string;
  description: string;
  duration_seconds: number;
  is_public: boolean;
}

const VideosPage = () => {
  const role = (localStorage.getItem("role") || "viewer") as UserRole;

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const [formData, setFormData] = useState<VideoFormData>({
    channel_id: 1,
    genre_id: 1,
    title: "",
    description: "",
    duration_seconds: 0,
    is_public: true,
  });

  const canCreate = role === "admin" || role === "creator";
  const canEdit = role === "admin" || role === "creator";
  const canDelete = role === "admin";

  const fetchVideos = async () => {
    try {
      setLoading(true);

      const data = await getAllVideos();

      setVideos(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to fetch videos"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const filteredVideos = useMemo(() => {
    return videos.filter((video) =>
      video.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [videos, search]);

  const resetForm = () => {
    setFormData({
      channel_id: 1,
      genre_id: 1,
      title: "",
      description: "",
      duration_seconds: 0,
      is_public: true,
    });
  };

  const handleCreateVideo = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setError("");

      await createVideo({
        channel_id: formData.channel_id,
        genre_id: formData.genre_id,
        title: formData.title,
        description: formData.description,
        duration_seconds: formData.duration_seconds,
        is_public: formData.is_public,
      });

      setSuccess("Video created successfully");

      setShowCreateModal(false);

      resetForm();

      fetchVideos();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to create video"
      );
    }
  };

  const openEditModal = (video: Video) => {
    setSelectedVideo(video);

    setFormData({
      channel_id: video.channel_id,
      genre_id: video.genre_id,
      title: video.title,
      description: video.description || "",
      duration_seconds: video.duration_seconds,
      is_public: video.is_public,
    });

    setShowEditModal(true);
  };

  const handleUpdateVideo = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!selectedVideo) return;

    try {
      setError("");

      await updateVideo(selectedVideo.video_id, {
        title: formData.title,
        description: formData.description,
        duration_seconds: formData.duration_seconds,
        is_public: formData.is_public,
      });

      setSuccess("Video updated successfully");

      setShowEditModal(false);

      fetchVideos();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to update video"
      );
    }
  };

  const handleDeleteVideo = async (
    id: number
  ) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this video?"
    );

    if (!confirmDelete) return;

    try {
      await deleteVideo(id);

      setSuccess("Video deleted successfully");

      fetchVideos();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to delete video"
      );
    }
  };

  const totalVideos = videos.length;

  const publicVideos = videos.filter(
    (video) => video.is_public
  ).length;

  const totalViews = videos.reduce(
    (sum, video) => sum + Number(video.view_count),
    0
  );

    return (
    <section className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Total Videos</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {totalVideos}
          </h2>
        </div>

      
      </div>

      {/* Header */}
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-slate-900">
            Videos Management
          </h1>

          {canCreate && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              + Create Video
            </button>
          )}
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div className="rounded-xl bg-green-100 p-4 text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <input
          type="text"
          placeholder="Search video..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
          Loading videos...
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Duration</th>
                  <th className="px-4 py-3 text-left">Views</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredVideos.map((video) => (
                  <tr
                    key={video.video_id}
                    className="border-b hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">{video.video_id}</td>

                    <td className="px-4 py-3 font-medium">
                      {video.title}
                    </td>

                    <td className="px-4 py-3">
                      {video.duration_seconds} sec
                    </td>


                    

                    <td className="px-4 py-3">
                      {Number(video.view_count).toLocaleString()}
                    </td>

                    <td className="px-4 py-3">
                      {video.is_public ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          Public
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                          Private
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {canEdit && (
                          <button
                            onClick={() => openEditModal(video)}
                            className="rounded-lg bg-yellow-500 px-3 py-2 text-sm text-white"
                          >
                            Edit
                          </button>
                        )}

                        {canDelete && (
                          <button
                            onClick={() =>
                              handleDeleteVideo(video.video_id)
                            }
                            className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white"
                          >
                            Delete
                          </button>
                        )}

                        {role === "viewer" && (
                          <span className="text-slate-500">
                            View Only
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6">
            <h2 className="mb-6 text-2xl font-bold">
              Create Video
            </h2>

            <form
              onSubmit={handleCreateVideo}
              className="space-y-4"
            >
             

              

              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                className="w-full rounded-xl border p-3"
              />

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="w-full rounded-xl border p-3"
              />

              <input
                type="number"
                placeholder="Duration"
                value={formData.duration_seconds}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration_seconds: Number(e.target.value),
                  })
                }
                className="w-full rounded-xl border p-3"
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_public}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_public: e.target.checked,
                    })
                  }
                />
                Public Video
              </label>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-600 py-3 text-white"
                >
                  Create
                </button>

                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 rounded-xl border py-3"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6">
            <h2 className="mb-6 text-2xl font-bold">
              Edit Video
            </h2>

            <form
              onSubmit={handleUpdateVideo}
              className="space-y-4"
            >
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                className="w-full rounded-xl border p-3"
              />

              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="w-full rounded-xl border p-3"
              />

              <input
                type="number"
                value={formData.duration_seconds}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration_seconds: Number(e.target.value),
                  })
                }
                className="w-full rounded-xl border p-3"
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_public}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_public: e.target.checked,
                    })
                  }
                />
                Public Video
              </label>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-green-600 py-3 text-white"
                >
                  Update
                </button>

                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 rounded-xl border py-3"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default VideosPage;