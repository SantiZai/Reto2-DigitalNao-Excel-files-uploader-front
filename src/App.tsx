import { useState } from "react";
import Excel from "./components/Excel";
import Navbar from "./components/Navbar";

function App() {
  const ADMIN = { username: "Santi", password: "San" };

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(
    {} as { username: string; password: string }
  );

  const login = (username: string, password: string) => {
    setUser({ username, password });
    if (username === ADMIN.username && password === ADMIN.password)
      setLoggedIn(true);
    else setLoggedIn(false);
  };

  return (
    <div className="container-fluid">
      <Navbar login={login} loggedIn={loggedIn} />
      <Excel />
    </div>
  );
}

export default App;
