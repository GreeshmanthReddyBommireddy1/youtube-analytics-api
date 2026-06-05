import apiClient from '../api/axios';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types/models';

export const getAllUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<User[]>('/users');
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await apiClient.get<User>(`/users/${id}`);
  return response.data;
};

export const createUser = async (payload: CreateUserRequest): Promise<User> => {
  const response = await apiClient.post<User>('/users', payload);
  return response.data;
};

export const updateUser = async (id: number, payload: UpdateUserRequest): Promise<User> => {
  const response = await apiClient.put<User>(`/users/${id}`, payload);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};
