// src/components/NoteList/NoteList.tsx

import React, { useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
// ✅ Імпортуємо і функцію, і ТИП відповіді з одного місця
import { fetchNotes, deleteNote } from "../../services/noteService";
import type { FetchNotesResponse } from "../../services/noteService";
import css from "./NoteList.module.css";
// ✅ Тепер тип Note також не потрібен, бо він є частиною FetchNotesResponse
// import type { Note } from "../../types/note";

interface NoteListProps {
  page: number;
  perPage: number;
  search: string;
  setTotalPages: (pages: number) => void;
}

// ❌ Видаляємо дубльований інтерфейс
// interface FetchNotesResponse {
//   items: Note[];
//   totalPages: number;
// }

const NoteList: React.FC<NoteListProps> = ({
  page,
  perPage,
  search,
  setTotalPages,
}) => {
  const queryClient = useQueryClient();

  // ✅ Типізуємо useQuery імпортованим інтерфейсом
  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes({ page, perPage, search }),
    placeholderData: keepPreviousData,
  });

  // ... (решта коду компонента без змін)
  const mutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  useEffect(() => {
    if (data?.totalPages) {
      setTotalPages(data.totalPages);
    }
  }, [data, setTotalPages]);

  if (isLoading) return <p>Loading notes...</p>;
  if (isError) return <p>Failed to load notes</p>;
  if (!data || !data.notes || data.notes.length === 0) {
    return <p>No notes found</p>;
  }

  return (
    <ul className={css.list}>
      {data.notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => mutation.mutate(note.id)}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
