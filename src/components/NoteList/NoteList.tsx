import React, { useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { fetchNotes, deleteNote } from "../../services/noteService";
import css from "./NoteList.module.css";
import type { Note } from "../../types/note";

interface NoteListProps {
  page: number;
  perPage: number;
  search: string;
  setTotalPages: (pages: number) => void;
}

interface FetchNotesResponse {
  items: Note[];
  totalPages: number;
}

const NoteList: React.FC<NoteListProps> = ({
  page,
  perPage,
  search,
  setTotalPages,
}) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes({ page, perPage, search }),
    placeholderData: keepPreviousData,
  });

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
  if (!data || data.items.length === 0) return <p>No notes found</p>;

  return (
    <ul className={css.list}>
      {data.items.map((note) => (
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
