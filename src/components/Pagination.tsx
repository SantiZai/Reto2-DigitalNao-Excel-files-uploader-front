import { useState } from "react";

const Pagination = ({
  pagesCount,
  actualPage,
  quantityPages,
  setActualPage,
}: {
  pagesCount: number;
  actualPage: number;
  quantityPages: number;
  setActualPage: (page: number) => void;
}) => {
  const handlePage = (page: number) => setActualPage(page);
  return (
    <div>
      <span>{actualPage}</span>
    </div>
  );
};

export default Pagination;
