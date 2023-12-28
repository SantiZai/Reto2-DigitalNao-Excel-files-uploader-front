import { useState } from "react";
import * as XLSX from "xlsx";

const Excel = () => {
  const [editable, setEditable] = useState(false);

  // onchange states
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState<string | null>(null);

  // submit states
  const [excelData, setExcelData] = useState<any>(null);

  // onchange event
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

  const handleChange = (e: any, index: number) => {
    const { name, value } = e.target;
    const updatedData = excelData.map((entry: any, i: number) => {
      console.log(index, i);
      if (index === i) {
        return { ...entry, [name]: value };
      }
      return entry;
    });
    setExcelData(updatedData);
  };

  // submit event
  const handleFileSubmit = (e: any) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data.slice(0, 10));
    }
  };

  return (
    <>
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

      {/* Load information modal */}
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
                  className="btn btn-success btn-md"
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
      <div>
        {excelData ? (
          <div>
            <table className="table">
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
                    {Object.keys(row).map((key) => (
                      <td key={key}>
                        <input
                          name={key}
                          value={row[key]}
                          onChange={(e) => handleChange(e, index)}
                          style={{ border: "none", outline: "none"}}
                          readOnly={!editable}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>Selecciona un archivo</div>
        )}
      </div>
    </>
  );
};

export default Excel;
