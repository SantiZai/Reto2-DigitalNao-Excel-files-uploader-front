const API = import.meta.env.VITE_API_URL

export const signIn = async (user: { username: string; password: string }) => {
  try {
    const response = await fetch(`${API}/users/login`, {
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
