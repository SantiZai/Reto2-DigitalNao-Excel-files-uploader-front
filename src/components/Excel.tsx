import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { getData, postData, updateData, deleteData } from "../utils/manageData";
import Pagination from "./Pagination";
import { toast } from "sonner";

const Excel = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  // onchange states
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState<string | null>(null);

  // data state
  const [excelData, setExcelData] = useState<any>(null);

  // pagination states
  const [actualPage, setActualPage] = useState<number>(1);
  const [pagesCount, setPagesCount] = useState<number>(1);

  // transform the dates to a valid format before save in the db
  const transformDate = (str: string): string => {
    let arr: string | string[] = str.split("-");
    let year = `20${arr[2]}`;
    arr = arr.slice(0, 2);
    arr.splice(0, 0, year);
    arr = arr.join("-");
    return arr;
  };

  // onchange file event
  const handleFile = (e: any) => {
    const fileTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        const reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e: any) => {
          setExcelFile(e.target.result);
        };
      } else {
        setTypeError("Please select only excel file types");
        setExcelFile(null);
      }
    } else {
      console.log("Please select your file");
    }
  };

  // submit event
  const handleFileSubmit = async (e: any) => {
    e.preventDefault();
    if (!sessionStorage.getItem("token")) return;
    if (excelFile !== null) {
      // read the excel file
      const workbook = XLSX.read(excelFile, { type: "buffer" });

      // use the first sheet of the workbook
      const worksheetName = workbook.SheetNames[0];

      // find the sheet with the name previously selected
      const worksheet = workbook.Sheets[worksheetName];

      /**
       * transform the table to json
       * dont parse the numbers, rawNumbers: false obtain the field in string format
       */
      const data = XLSX.utils.sheet_to_json(worksheet, {
        rawNumbers: false,
        defval: "",
      });

      const dateMap = data.map((entry: any) => {
        entry["WO Start Date"] = transformDate(entry["WO Start Date"]);
        entry["Request Date F553312.DRQJ"] = transformDate(
          entry["Request Date F553312.DRQJ"]
        );
        return entry;
      });

      // delete the previous file and save new file into the db
      deleteData();
      await postData(dateMap).then(() => {
        setActualPage(1);
        getData(actualPage).then((res) => setExcelData(res.batchedData));
      });
    }
  };

  // onchange input event
  const handleChange = async (e: any, index: number, key: string) => {
    const { name, value } = e.target;
    if (
      key === "WO Start Date" ||
      key === "wOStartDate" ||
      key === "Request Date F553312.DRQJ" ||
      key === "requestDate"
    ) {
      // transform the date to local zone
      const date = new Date(e.target.value);
      date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
      if (date.getDay() === 6 || date.getDay() === 0) {
        toast.error("No se pueden seleccionar sábados o domingos");
        return;
      }
    }
    const updatedData = excelData.map((entry: any, i: number) => {
      if (index === i) {
        return { ...entry, [name]: value };
      }
      return entry;
    });
    setExcelData(updatedData);
  };

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      getData(actualPage)
        .then((res) => {
          if (res.batchedData.length > 0) {
            setExcelData(res.batchedData);
            setPagesCount(Math.ceil(res.dataLength / 10));
          }
        })
        .catch((err) => console.error(err));
    }
  }, [sessionStorage.getItem("token"), actualPage]);

  return (
    <div className="container text-center mt-2">
      {isLoggedIn ? (
        <button
          className="btn btn-outline-primary mx-2 mb-2"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#loadInfoModalContainer"
        >
          Cargar información
        </button>
      ) : (
        <h2>Se necesita iniciar sesión</h2>
      )}

      {/* load information modal */}
      <div
        className="modal fade"
        id="loadInfoModalContainer"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="loadInfoModal"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <span
                className="modal-title fs-5"
                id="loadInfoModal"
              >
                Cargar información
              </span>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <span>Seleccionar archivo de Excel</span>

              {/* input for the file */}
              <form
                className="form-group custom-form"
                onSubmit={handleFileSubmit}
              >
                <input
                  type="file"
                  className="form-control"
                  required
                  onChange={handleFile}
                />
                <button
                  type="submit"
                  className="btn btn-success btn-md mt-2"
                  data-bs-dismiss="modal"
                >
                  Subir
                </button>
                {typeError && (
                  <div
                    className="alert alert-danger"
                    role="alert"
                  >
                    {typeError}
                  </div>
                )}
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* render the data */}
      {/* TODO: hacer algo con el loading */}
      {isLoggedIn && excelData ? (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  {/* generate the keys of the table */}
                  {Object.keys(excelData[0]).map((col: string, i: number) => {
                    return (
                      <th
                        scope="col"
                        key={i}
                      >
                        {col}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {/* generate the entries for the table */}
                {excelData.slice(0, 10).map((row: any, index: number) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    {Object.keys(row).map((key) => (
                      <td
                        key={key}
                        className="p-2"
                      >
                        <div className="d-flex">
                          <input
                            name={key}
                            type={
                              key === "wOStartDate" ||
                              key === "WO Start Date" ||
                              key === "requestDate" ||
                              key === "Request Date F553312.DRQJ"
                                ? "date"
                                : key === "quantityOrderer" ||
                                  key === "Quantity Ordered "
                                ? "number"
                                : "text"
                            }
                            style={{ border: "none", outline: "none" }}
                            value={
                              typeof row[key] === "string"
                                ? row[key].trim()
                                : row[key]
                            }
                            onChange={(e) => handleChange(e, index, key)}
                            readOnly={true}
                          />
                          {((key === "quantityOrderer" ||
                            key === "requestDate") &&
                            Number(row["wOStatus"]) < 11) ||
                          (key !== "quantityOrderer" &&
                            key !== "requestDate" &&
                            key !== "_id") ? (
                            <button
                              className="btn btn-primary mx-2 px-4 py-1"
                              onClick={(e: any) => {
                                let input = e.target.previousElementSibling;
                                input.readOnly = !input.readOnly;
                                if (input.readOnly) {
                                  (input.style.border = "none"),
                                    (input.style.outline = "none");
                                  e.target.innerText = "Editar";
                                  updateData(row._id, row);
                                } else {
                                  input.style.border = "1px solid black";
                                  e.target.innerText = "Guardar";
                                }
                              }}
                            >
                              Editar
                            </button>
                          ) : (
                            <></>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex align-items-center justify-content-center gap-4 pt-4">
            <button
              className={`btn btn-outline-primary ${
                actualPage === 1 ? "disabled" : ""
              }`}
              onClick={() => setActualPage(actualPage - 1)}
            >
              {"<"}
            </button>
            <Pagination
              pagesCount={pagesCount}
              actualPage={actualPage}
              setActualPage={setActualPage}
            />
            <button
              className={`btn btn-outline-primary ${
                actualPage === pagesCount ? "disabled" : ""
              }`}
              onClick={() => setActualPage(actualPage + 1)}
            >
              {">"}
            </button>
          </div>
        </>
      ) : (
        isLoggedIn && <span>Selecciona un archivo</span>
      )}
    </div>
  );
};

export default Excel;
