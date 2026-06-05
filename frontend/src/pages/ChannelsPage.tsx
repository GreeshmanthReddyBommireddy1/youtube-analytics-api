import { useEffect, useMemo, useState } from "react";
import {
  getAllChannels,
  createChannel,
  updateChannel,
  deleteChannel,
} from "../services/channelService";
import type { Channel } from "../types/models";

type UserRole = "admin" | "creator" | "viewer";

interface ChannelFormData {
  user_id: number;
  channel_name: string;
  description: string;
  is_verified: boolean;
}

const ChannelsPage = () => {
  const role = (localStorage.getItem("role") || "viewer") as UserRole;
  const currentUserId = Number(localStorage.getItem("user_id"));

  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const [formData, setFormData] = useState<ChannelFormData>({
    user_id: currentUserId,
    channel_name: "",
    description: "",
    is_verified: false,
  });

  const canCreate = role === "admin" || role === "creator";
  const canEdit = role === "admin" || role === "creator";
  const canDelete = role === "admin";

  const fetchChannels = async () => {
    try {
      setLoading(true);

      const data = await getAllChannels();

      setChannels(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to fetch channels"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const filteredChannels = useMemo(() => {
    return channels.filter((channel) =>
      channel.channel_name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [channels, search]);

  const resetForm = () => {
    setFormData({
      user_id: currentUserId,
      channel_name: "",
      description: "",
      is_verified: false,
    });
  };

  const handleCreateChannel = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setError("");

      await createChannel({
        user_id: currentUserId,
        channel_name: formData.channel_name,
        description: formData.description,
      });

      setSuccess("Channel created successfully");

      setShowCreateModal(false);

      resetForm();

      fetchChannels();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to create channel"
      );
    }
  };

  const openEditModal = (channel: Channel) => {
    setSelectedChannel(channel);

    setFormData({
      user_id: channel.user_id,
      channel_name: channel.channel_name,
      description: channel.description || "",
      is_verified: channel.is_verified,
    });

    setShowEditModal(true);
  };

  const handleUpdateChannel = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!selectedChannel) return;

    try {
      setError("");

      await updateChannel(selectedChannel.channel_id, {
        channel_name: formData.channel_name,
        description: formData.description,
        is_verified: formData.is_verified,
      });

      setSuccess("Channel updated successfully");

      setShowEditModal(false);

      fetchChannels();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to update channel"
      );
    }
  };

  const handleDeleteChannel = async (
    id: number
  ) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this channel?"
    );

    if (!confirmDelete) return;

    try {
      await deleteChannel(id);

      setSuccess("Channel deleted successfully");

      fetchChannels();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to delete channel"
      );
    }
  };

  const totalChannels = channels.length;

  const verifiedChannels = channels.filter(
    (channel) => channel.is_verified
  ).length;

    return (
    <section className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Total Channels</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {totalChannels}
          </h2>
        </div>

        

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Current Role</p>
          <h2 className="mt-2 text-2xl font-bold capitalize text-blue-600">
            {role}
          </h2>
        </div>
      </div>

      {/* Header */}
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-slate-900">
            Channels Management
          </h1>

          {canCreate && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              + Create Channel
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
          placeholder="Search channel..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
          Loading channels...
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredChannels.map((channel) => (
                  <tr
                    key={channel.channel_id}
                    className="border-b hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">
                      {channel.channel_id}
                    </td>

                    <td className="px-4 py-3 font-medium">
                      {channel.channel_name}
                    </td>

                    <td className="px-4 py-3">
                      {channel.description}
                    </td>

                    

                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {canEdit && (
                          <button
                            onClick={() =>
                              openEditModal(channel)
                            }
                            className="rounded-lg bg-yellow-500 px-3 py-2 text-sm text-white"
                          >
                            Edit
                          </button>
                        )}

                        {canDelete && (
                          <button
                            onClick={() =>
                              handleDeleteChannel(
                                channel.channel_id
                              )
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
              Create Channel
            </h2>

            <form
              onSubmit={handleCreateChannel}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Channel Name"
                required
                value={formData.channel_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    channel_name: e.target.value,
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

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-600 py-3 text-white"
                >
                  Create
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowCreateModal(false)
                  }
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
              Edit Channel
            </h2>

            <form
              onSubmit={handleUpdateChannel}
              className="space-y-4"
            >
              <input
                type="text"
                value={formData.channel_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    channel_name: e.target.value,
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

              

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-green-600 py-3 text-white"
                >
                  Update
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowEditModal(false)
                  }
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

export default ChannelsPage;