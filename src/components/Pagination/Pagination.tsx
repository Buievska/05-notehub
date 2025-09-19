import React from "react";
import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  return (
    <ReactPaginate
      className={css.pagination}
      pageClassName={css.pageItem}
      activeClassName={css.active}
      previousLabel="<"
      nextLabel=">"
      breakLabel="..."
      pageCount={totalPages}
      forcePage={page - 1}
      onPageChange={(selectedItem) => onPageChange(selectedItem.selected + 1)} // конвертуємо назад у 1-індексацію
    />
  );
};

export default Pagination;
