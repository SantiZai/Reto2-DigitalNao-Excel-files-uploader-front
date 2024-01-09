import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { deleteData, getData, postData } from "../utils/manageData";

const Excel = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const [editable, setEditable] = useState(false);

  // onchange states
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState<string | null>(null);

  // data state
  const [excelData, setExcelData] = useState<any>(null);

  // pagination state
  const [actualPage, setActualPage] = useState<string>("1");

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

  // onchange input event
  const handleChange = (e: any, index: number) => {
    const { name, value } = e.target;
    const updatedData = excelData.map((entry: any, i: number) => {
      if (index === i) {
        return { ...entry, [name]: value };
      }
      return entry;
    });
    setExcelData(updatedData);
  };

  // submit event
  const handleFileSubmit = async (e: any) => {
    e.preventDefault();
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
      const data = XLSX.utils.sheet_to_json(worksheet, { rawNumbers: false });

      // set the data into the state
      setExcelData(data);

      // delete the previous file and save new file into the db
      deleteData();
      postData(data);
    }
  };

  useEffect(() => {
    getData(actualPage).then((res) => {
      if (res.length > 0) setExcelData(res);
    });
  }, [actualPage]);

  return (
    <div className="container text-center mt-2">
      {isLoggedIn ? (
        <div className="mb-2">
          <button
            className="btn btn-outline-primary mx-2"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#loadInfoModalContainer"
          >
            Cargar información
          </button>
          <button
            className="btn btn-outline-secondary mx-2"
            onClick={() => setEditable(!editable)}
          >
            {editable ? "Guardar" : "Editar"}
          </button>
        </div>
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
      {excelData ? (
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
                {excelData.map((row: any, index: number) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    {Object.keys(row).map((key) => (
                      <td key={key}>
                        <input
                          name={key}
                          value={
                            typeof row[key] === "string"
                              ? row[key].trim()
                              : row[key]
                          }
                          onChange={(e) => handleChange(e, index)}
                          style={
                            editable
                              ? { border: "1px solid black" }
                              : { border: "none", outline: "none" }
                          }
                          readOnly={!editable}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            {/* TODO: generate a functional pagination */}
            <span onClick={() => setActualPage("1")}>1</span>
            <span onClick={() => setActualPage("2")}>2</span>
            <span onClick={() => setActualPage("3")}>3</span>
          </div>
        </>
      ) : (
        isLoggedIn && <span>Selecciona un archivo</span>
      )}
    </div>
  );
};

export default Excel;
