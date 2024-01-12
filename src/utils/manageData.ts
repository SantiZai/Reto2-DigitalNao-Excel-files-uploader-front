const PORT = 4200;

export const getData = async (page: number = 1) => {
  try {
    const response = await fetch(`http://localhost:${PORT}/data?page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const postData = async (data: any) => {
  // set a max number of data for each petition to dont charge the payload
  const batchSize = 50;
  // create various petitions to the api
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    try {
      const response = await fetch(`http://localhost:${PORT}/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(batch),
      });

      if (!response.ok) {
        console.log(response.status, response.text);
        throw new Error("Request failed!");
      }

      const json = await response.json();
      console.log(json);
    } catch (err) {
      console.error(err);
    }
  }
};

export const deleteData = async () => {
  try {
    const response = await fetch(`http://localhost:${PORT}/data`, {
      method: "DELETE",
    });
    console.log(response, response.status);
  } catch (err) {
    console.error(err);
  }
};
