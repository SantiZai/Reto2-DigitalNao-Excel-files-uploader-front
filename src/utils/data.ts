const PORT = 4200;

// TODO: manage the errors with try catch
export const getData = async () => {
  const response = await fetch(`http://localhost:${PORT}/data`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};

/* export const postData = async (data: any) => {
  try {
    const response = await fetch(`http://localhost:${PORT}/data`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    console.log(response, response.status);
  } catch (err) {
    console.error(err);
  }
}; */

export const postData = async (data: any) => {
  try {
    const response = await fetch(`http://localhost:${PORT}/data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data.slice(0, 10)),
    });

    if (!response.ok) {
        console.log(response.status, response.text)
      throw new Error("Request failed!");
    }

    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error);
  }
};

export const deleteData = async () => {
  const response = await fetch(`http://localhost:${PORT}/data`, {
    method: "DELETE",
  });
  console.log(response, response.status);
};
