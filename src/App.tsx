import { useState } from "react";
import Excel from "./components/Excel";
import Navbar from "./components/Navbar";
import { signIn } from "./utils/login";

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState(
    {} as { username: string; password: string }
  );

  const login = async (username: string, password: string) => {
    setUser({ username, password });
    if (!user) return;
    await signIn({ username, password }).then((res) =>
      localStorage.setItem("token", res.token)
    );
    setLoggedIn(true);
  };

  return (
    <div className="container-fluid">
      <Navbar
        login={login}
        loggedIn={loggedIn}
      />
      <Excel isLoggedIn={loggedIn} />
    </div>
  );
}

export default App;
