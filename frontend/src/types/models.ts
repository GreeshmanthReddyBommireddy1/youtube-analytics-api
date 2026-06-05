export interface User {
  user_id: number;
  username: string;
  email: string;
  full_name: string;
  country_code: string;
  joined_at: string;
  is_active: boolean;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  full_name: string;
  country_code: string;
}

export interface UpdateUserRequest {
  full_name?: string;
  country_code?: string;
}

export interface Channel {
  channel_id: number;
  user_id: number;
  channel_name: string;
  description?: string;
  created_at: string;
  is_verified: boolean;
}

export interface Video {
  video_id: number;
  channel_id: number;
  genre_id: number;
  title: string;
  description?: string;
  upload_date: string;
  duration_seconds: number;
  view_count: number;
  like_count: number;
  dislike_count: number;
  is_public: boolean;
}
