const PORT = 4200;

export const signIn = async (user: { username: string; password: string }) => {
  try {
    const response = await fetch(`http://localhost:${PORT}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      console.log(response.status, response.text);
      throw new Error("Request failed");
    }
    const json = await response.json();
    return json;
  } catch (err) {
    console.error(err);
  }
};
