import type { UUIDTypes } from 'uuid';

type TUserRole = 'admin' | 'user';
export type TUser = {
  id: UUIDTypes;
  email: string;
  nickname: string;
  password_hash: string | null;
  role: TUserRole;
  google_id: string | null;
  avatar_url: string | null;
};

export type TCreateUserData = {
  email: string;
  nickname: string;
  password_hash?: string | null;
  google_id?: string | null;
  avatar_url?: string | null;
};
