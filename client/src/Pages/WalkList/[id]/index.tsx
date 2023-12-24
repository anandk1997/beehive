import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { useState } from "react";

import { data, options, registerChart } from "src/utils/chart";
import { socket } from "src/utils/Socket";

registerChart();

export const Beacon = () => {
  const { id } = useParams();
  const [chartData, setChartData] = useState<IChartData>(data());
  const [currentEvent, setCurrentEvent] = useState("");
  const [beaconsData, setBeaconsData] = useState("");

  socket.emit("send_message", id?.toString());

  socket.on("receive_message", (newData) => {
    console.log(";;;;;;;;;;;;;", newData);
  });

  socket.on("testingroom", (newData) => {
    console.log("............testingroom........", newData);
  });

  socket.on("liveBeacon", (newData) => {
    const parsedData = JSON.parse(newData);
    console.log("newData", JSON.parse(newData));
    const { xMP, yMP, time, beaconsData } = parsedData;

    setCurrentEvent(time);
    setBeaconsData(beaconsData);

    setChartData((prevData) => {
      const newLabels = [...prevData?.labels, xMP];
      const newDatasetData = [...prevData?.datasets?.[0]?.data, yMP];
      const newTimestamps = [...prevData?.datasets?.[0]?.timestamps, time];

      return {
        labels: newLabels,
        datasets: [
          {
            ...prevData?.datasets?.[0],
            data: newDatasetData,
            timestamps: newTimestamps,
          },
        ],
      };
    });
  });

  return (
    <>
      <Line options={options()} data={chartData} />

      <div>Current Event : {currentEvent}</div>
      <div className="">Beacons Data : {beaconsData}</div>
    </>
  );
};

export default Beacon;

export interface IChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    timestamps: string[];
    xMP0: number[];
    xMP1: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

export const chartOptionsWithCasting: DeepPartial<typeof options> = options;
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
