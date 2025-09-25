import React from "react";
import { useDebounce } from "use-debounce";
import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import type { FetchNotesResponse } from "../../services/noteService";

const App: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch] = useDebounce(search, 500); // Затримка 500 мс
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, debouncedSearch], // Використовуємо debouncedSearch
    queryFn: () =>
      fetchNotes({ page, perPage: 12, search: debouncedSearch ?? "" }),
    placeholderData: keepPreviousData,
  });

  // Скидаємо сторінку на першу при зміні пошукового запиту
  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const totalPages = data?.totalPages ?? 1;

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />
        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
        <button className={css.button} onClick={handleOpenModal}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Failed to load notes</p>}
      {/* Проп onDelete більше не передається */}
      {data && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
};

export default App;
