const Pagination = ({
  pagesCount,
  actualPage,
  setActualPage,
}: {
  pagesCount: number;
  actualPage: number;
  setActualPage: (page: number) => void;
}) => {
  const handlePage = (page: number) => setActualPage(page);
  return (
    <div>
      {actualPage === 1 ? null : actualPage === 2 ? (
        <span
          onClick={(e: React.MouseEvent<HTMLSpanElement>) =>
            handlePage(Number(e.currentTarget.innerHTML))
          }
        >
          {actualPage - 1}
        </span>
      ) : (
        <>
          <span
            onClick={(e: React.MouseEvent<HTMLSpanElement>) =>
              handlePage(Number(e.currentTarget.innerHTML))
            }
          >
            {actualPage - 2}
          </span>
          <span
            onClick={(e: React.MouseEvent<HTMLSpanElement>) =>
              handlePage(Number(e.currentTarget.innerHTML))
            }
          >
            {actualPage - 1}
          </span>
        </>
      )}
      <span>{actualPage}</span>
      {actualPage === pagesCount ? null : actualPage === pagesCount - 1 ? (
        <span
          onClick={(e: React.MouseEvent<HTMLSpanElement>) =>
            handlePage(Number(e.currentTarget.innerHTML))
          }
        >
          {actualPage + 1}
        </span>
      ) : (
        <>
          <span
            onClick={(e: React.MouseEvent<HTMLSpanElement>) =>
              handlePage(Number(e.currentTarget.innerHTML))
            }
          >
            {actualPage + 1}
          </span>
          <span
            onClick={(e: React.MouseEvent<HTMLSpanElement>) =>
              handlePage(Number(e.currentTarget.innerHTML))
            }
          >
            {actualPage + 2}
          </span>
        </>
      )}
    </div>
  );
};

export default Pagination;
