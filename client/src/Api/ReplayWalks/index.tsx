import toast from "react-hot-toast";
import axios from "axios";

import { API_URL } from "src/env";

export const fetchWalkDetails = async (id: any, setWalkData: any) => {
  try {
    const response = await axios.get(`${API_URL}/beaconData?walkID=${id}`);
    setWalkData(response?.data);

    return response?.data;
    // const xMP1Array =
    //   response?.data.map((item: any) =>
    //     item?.xMP1?.split(/,(?=\()/).splice(1)
    //   ) ?? [];

    // const maxLength = Math.max(...xMP1Array.map((arr: any) => arr?.length));

    // const maxBeaconArray =
    //   xMP1Array?.find((arr: any) => arr.length === maxLength) ?? [];

    // console.log("maxBeaconArray", maxBeaconArray);
  } catch (error) {
    console.log("Get Beacon Error : ", error);

    return [];
  }
};

export const downloadCsv = async (id?: string) => {
  const apiUrl = `${API_URL}/downloadcsv?id=${id}`;

  try {
    const response = await axios({
      url: apiUrl,
      method: "GET",
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast.success(`Walk Downloaded`);
  } catch (error) {
    console.error("Error downloading CSV:", error);
    toast.success(`Error Downloading Walk`);
  }
};

export const calculateDistanceAndMidpoint = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const midpoint = {
    x: Number(((x1 + x2) / 2).toFixed(2)),
    y: Number(((y1 + y2) / 2).toFixed(2)),
  };

  return {
    distance: Number(distance.toFixed(2)),
    midpoint,
  };
};

export const addMidPoints = (walkData: any, setWalkData: any) => {
  for (let pageNumber = 0; pageNumber < walkData?.length; pageNumber++) {
    const nextDataPointxMP = Number(walkData?.[pageNumber]?.xMP);
    const nextDataPointyMP = Number(walkData?.[pageNumber]?.yMP);

    const { distance, midpoint } = calculateDistanceAndMidpoint(
      parseInt(walkData?.[pageNumber - 1]?.xMP) || 0,
      parseInt(walkData?.[pageNumber - 1]?.yMP) || 0,
      nextDataPointxMP ?? 0,
      nextDataPointyMP ?? 0
    );

    if (distance > 3) {
      let index = pageNumber - 1;
      if (index !== -1) {
        const newArray = [
          ...walkData?.slice(0, index + 1),
          { xMP: midpoint?.x, yMP: midpoint?.y },
          ...walkData?.slice(index + 1),
        ];
        // setWalkData(newArray);

        console.log("newArray", newArray);
      }
    }
  }
};
