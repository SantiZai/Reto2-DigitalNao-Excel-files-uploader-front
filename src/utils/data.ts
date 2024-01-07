// TODO: manage the errors with try catch
export const getData = async () => {
  const response = await fetch("http://localhost:3000/data", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};

export const postData = async (data: any) => {
  const response = await fetch("http://localhost:3000/data", {
    method: "POST",
    body: data,
  });
  console.log(response, response.status);
};

export const deleteData = async () => {
  const response = await fetch("http://localhost:3000/data", {
    method: "DELETE",
  });
  console.log(response, response.status);
};
