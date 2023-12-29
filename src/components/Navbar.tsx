import { useState } from "react";
import Logo from "../assets/logo-nlmx.png";

interface Props {
  login: (username: string, password: string) => void;
  loggedIn: boolean;
}

const Navbar = (props: Props) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  } as { username: string; password: string });

  const handleLogin = (credentials: { username: string; password: string }) => {
    const { username, password } = credentials;
    props.login(username, password);
  };

  // onchange login inputs event
  const handleInputs = (e: any) => {
    const updatedCredentials = {
      ...credentials,
      [e.target.name]: e.target.value,
    };
    setCredentials(updatedCredentials);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg border-bottom">
        <div className="container-fluid">
          <a
            className="navbar-brand"
            href="#"
          >
            <img
              src={Logo}
              alt="Logo"
              width="60"
              height="60"
              className="d-inline-block align-text-top"
            />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  aria-current="page"
                  href="#"
                >
                  Home
                </a>
              </li>
            </ul>
            {props.loggedIn ? (
              <div>
                <h5>Hola {credentials.username}!</h5>
              </div>
            ) : (
              <button
                className="btn btn-outline-success mx-2"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#loginModalContainer"
              >
                Iniciar sesión
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* login modal */}
      <div
        className="modal fade"
        id="loginModalContainer"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="loginModal"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <span
                className="modal-title fs-5"
                id="loginModal"
              >
                Iniciar sesión
              </span>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <span>Ingrese sus credenciales</span>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="floatingInput"
                  placeholder="Username"
                  name="username"
                  value={credentials.username}
                  onChange={(e) => handleInputs(e)}
                />
                <label htmlFor="floatingInput">Username</label>
              </div>
              <div className="form-floating">
                <input
                  type="password"
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                  name="password"
                  value={credentials.password}
                  onChange={(e) => handleInputs(e)}
                />
                <label htmlFor="floatingPassword">Password</label>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => setCredentials({ username: "", password: "" })}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={() => handleLogin(credentials)}
              >
                Iniciar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
