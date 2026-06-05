import apiClient from "../api/axios";
import type { Video } from "../types/models";

export const getAllVideos = async (): Promise<Video[]> => {
  const response = await apiClient.get("/videos");
  return response.data;
};

export const createVideo = async (data: {
  channel_id: number;
  genre_id: number;
  title: string;
  description: string;
  duration_seconds: number;
  is_public: boolean;
}) => {
  const response = await apiClient.post("/videos", data);
  return response.data;
};

export const updateVideo = async (
  id: number,
  data: {
    title: string;
    description: string;
    duration_seconds: number;
    is_public: boolean;
  }
) => {
  const response = await apiClient.put(`/videos/${id}`, data);
  return response.data;
};

export const deleteVideo = async (id: number) => {
  const response = await apiClient.delete(`/videos/${id}`);
  return response.data;
};