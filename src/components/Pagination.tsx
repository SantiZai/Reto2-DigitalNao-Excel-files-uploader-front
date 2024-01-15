const Pagination = ({
  pagesCount,
  actualPage,
  setActualPage,
}: {
  pagesCount: number;
  actualPage: number;
  setActualPage: (page: number) => void;
}) => {
  const actualPageStyles = {
    padding: "5px 10px",
    margin: "0 3px",
    backgroundColor: "blue",
    color: "white",
    cursor: "pointer",
    borderRadius: "5px",
  };

  const noActualPageStyles = {
    padding: "5px 10px",
    margin: "0 3px",
    border: "1px solid blue",
    color: "blue",
    cursor: "pointer",
    borderRadius: "5px",
  };
  const handlePage = (page: number) => setActualPage(page);
  return (
    <div>
      {actualPage === 1 ? null : actualPage === 2 ? (
        <span
          style={noActualPageStyles}
          onClick={(e: React.MouseEvent<HTMLSpanElement>) =>
            handlePage(Number(e.currentTarget.innerHTML))
          }
        >
          {actualPage - 1}
        </span>
      ) : (
        <>
          <span
            style={noActualPageStyles}
            onClick={(e: React.MouseEvent<HTMLSpanElement>) =>
              handlePage(Number(e.currentTarget.innerHTML))
            }
          >
            {actualPage - 2}
          </span>
          <span
            style={noActualPageStyles}
            onClick={(e: React.MouseEvent<HTMLSpanElement>) =>
              handlePage(Number(e.currentTarget.innerHTML))
            }
          >
            {actualPage - 1}
          </span>
        </>
      )}
      <span style={actualPageStyles}>{actualPage}</span>
      {actualPage === pagesCount ? null : actualPage === pagesCount - 1 ? (
        <span
          style={noActualPageStyles}
          onClick={(e: React.MouseEvent<HTMLSpanElement>) =>
            handlePage(Number(e.currentTarget.innerHTML))
          }
        >
          {actualPage + 1}
        </span>
      ) : (
        <>
          <span
            style={noActualPageStyles}
            onClick={(e: React.MouseEvent<HTMLSpanElement>) =>
              handlePage(Number(e.currentTarget.innerHTML))
            }
          >
            {actualPage + 1}
          </span>
          <span
            style={noActualPageStyles}
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
