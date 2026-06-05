import apiClient from "../api/axios";
import type { Channel } from "../types/models";

export const getAllChannels = async (): Promise<Channel[]> => {
  const response = await apiClient.get("/channels");
  return response.data;
};

export const createChannel = async (data: {
  channel_name: string;
  description: string;
}) => {
  const response = await apiClient.post("/channels", data);
  return response.data;
};

export const updateChannel = async (
  id: number,
  data: {
    channel_name: string;
    description: string;
    is_verified: boolean;
  }
) => {
  const response = await apiClient.put(`/channels/${id}`, data);
  return response.data;
};

export const deleteChannel = async (id: number) => {
  const response = await apiClient.delete(`/channels/${id}`);
  return response.data;
};