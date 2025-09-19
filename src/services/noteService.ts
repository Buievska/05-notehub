// src/services/noteService.ts

import axios from "axios";
import type { AxiosResponse } from "axios";
import type { Note } from "../types/note";

// ... (код ініціалізації axios залишається без змін)
const API_BASE = "https://notehub-public.goit.study/api";
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

if (!token) console.warn("VITE_NOTEHUB_TOKEN is not set!");

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  page: number;
  perPage: number;
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = "",
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  // Покращення: створюємо параметри для запиту
  const params: FetchNotesParams = { page, perPage };
  // Додаємо `search` тільки якщо він існує
  if (search) {
    params.search = search;
  }

  const res: AxiosResponse<FetchNotesResponse> = await client.get("/notes", {
    params,
  });

  // ✅ Головне виправлення: повертаємо дані з сервера напряму.
  // Тепер, якщо є помилка, useQuery її "зрозуміє" і покаже стан isError.
  return res.data;
};

// ... (решта файлу без змін)
export const createNote = async (payload: {
  title: string;
  content?: string;
  tag: string;
}): Promise<Note> => {
  const res: AxiosResponse<Note> = await client.post("/notes", payload);
  return res.data;
};

export const deleteNote = async (id: string): Promise<{ id: string }> => {
  const res: AxiosResponse<{ id: string }> = await client.delete(
    `/notes/${id}`
  );
  return res.data;
};
