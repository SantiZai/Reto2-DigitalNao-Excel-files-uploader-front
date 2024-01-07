export const getData = async () => {
  const response = await fetch("http://localhost:3000/data", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log(data);
};
