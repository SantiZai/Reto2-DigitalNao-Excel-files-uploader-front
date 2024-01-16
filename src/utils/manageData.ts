const PORT = 4200;

export type DataModel = {
  _id: string;
  branch: string;
  businessUnit: string;
  dailyCapacity: string;
  effectiveFrom: string;
  firmWO: string;
  itemNumber: string;
  monthDescription: string;
  monthlyCapacity: string;
  plannedReleased: string;
  plannedWO: string;
  primaryUOMHour: string;
  quantityOrderer: string;
  rateHour: string;
  requestDate: string;
  shortItem: string;
  typeOfRoutin: string;
  wOStartDate: string;
  wOStatus: string;
  weekNumberEffective: string;
  weeklyCapacity: string;
  workOrderNo: string;
  workOrderQuantity: string;
  __v: number;
};

export const getData = async (page: number = 1) => {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) return;
    const response = await fetch(`http://localhost:${PORT}/data?page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

//TODO: fix the types of the data
export const postData = async (data: any) => {
  // set a max number of data for each petition to dont charge the payload
  const batchSize = 50;
  // create various petitions to the api
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    console.log(batch);
    try {
      // verify if the token exists
      const token = sessionStorage.getItem("token");
      if (!token) return;
      const response = await fetch(`http://localhost:${PORT}/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
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

export const updateData = async (id: string, data: DataModel) => {
  try {
    console.log(data);
    const token = sessionStorage.getItem("token");
    if (!token) return;
    const response = await fetch(`http://localhost:${PORT}/data/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify(data),
    });
    console.log(response, response.status);
  } catch (err) {
    console.error(err);
  }
};

export const deleteData = async () => {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) return;
    const response = await fetch(`http://localhost:${PORT}/data`, {
      method: "DELETE",
      headers: {
        "x-auth-token": token,
      },
    });
    console.log(response, response.status);
  } catch (err) {
    console.error(err);
  }
};
