import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import toast from "react-hot-toast";

import { data, options, registerChart } from "src/utils/chart";
import { Loader } from "src/components/Loader";
import { socket } from "src/utils/Socket";
import { IChartData } from "../index";
import {
  calculateDistanceAndMidpoint,
  fetchWalkDetails,
  addMidPoints,
  downloadCsv,
} from "src/Api/ReplayWalks";

registerChart();

export const BeaconReplay = () => {
  const { id } = useParams();

  const [chartData, setChartData] = useState<IChartData>(data());
  const [walkData, setWalkData] = useState<any>([]);

  const [currentTimeStamp, setCurrentTimeStamp] = useState("");
  const [beaconDetail, setBeaconDetail] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [distance, setDistance] = useState(0);

  const {
    isPending,
    error,
    data: fetchedWalkData,
  } = useQuery({
    queryKey: ["walkData"],
    queryFn: () => fetchWalkDetails(id, setWalkData),
  });

  socket.emit("send_message", id?.toString());
  socket.on("receive_message", () => {});

  addMidPoints(walkData, setWalkData);

  useEffect(() => {
    const replayWalk = async () => {
      const timestamp = walkData?.[pageNumber]?.time;
      const xMP0 = walkData?.[pageNumber]?.xMP0 ?? 0;
      const beaconDataString = walkData?.[pageNumber]?.beaconData;
      // const xMP1 = walkData?.[0]?.xMP1?.split(/,(?=\()/).splice(1);

      if (timestamp) setCurrentTimeStamp(timestamp);
      if (beaconDataString) setBeaconDetail(beaconDataString);

      const nextDataPointxMP = parseFloat(walkData?.[pageNumber]?.xMP);
      const nextDataPointyMP = parseFloat(walkData?.[pageNumber]?.yMP);

      if (pageNumber > 1 && nextDataPointyMP) {
        const { distance } = calculateDistanceAndMidpoint(
          parseFloat(walkData[pageNumber - 1]?.xMP) ?? 0,
          parseFloat(walkData[pageNumber - 1]?.yMP) ?? 0,
          nextDataPointxMP,
          nextDataPointyMP
        );
        setDistance(distance);
      }

      setChartData((prevData) => {
        const newLabels = [...prevData.labels, walkData[pageNumber]?.xMP];
        const newDatasetData = [
          ...prevData.datasets[0].data,
          walkData[pageNumber]?.yMP,
        ];

        const newTimestamps = [
          ...prevData?.datasets?.[0]?.timestamps,
          timestamp,
        ];

        // const newXMP1 = walkData?.[0]?.xMP1.split(/,(?=\()/).splice(1) ?? [];

        // console.log("newXMP1", newXMP1);
        // const newDatasetXMP1 = [
        //   ...prevData?.datasets?.[0]?.xMP1,
        //   ...newXMP1?.map((coord: any) =>
        //     parseFloat(coord.replace(/[()]/g, ""))
        //   ),
        // ];

        // console.log("newDatasetXMP1", newDatasetXMP1);

        return {
          labels: newLabels,
          datasets: [
            {
              ...prevData.datasets[0],
              data: newDatasetData,
              timestamps: newTimestamps,
              // xMP0:walkData[pageNumber]?.xMP0
              xMP0: [...prevData?.datasets?.[0]?.xMP0, xMP0],
              // xMP1: newDatasetXMP1,
            },
          ],
        };
      });

      setPageNumber((prevPage) => prevPage + 1);
    };

    const intervalId = setInterval(() => replayWalk(), 1500);
    return () => clearInterval(intervalId);
  }, [pageNumber]);

  if (isPending) <Loader />;
  if (error) toast.error(error.message);
  return (
    <>
      <Line options={options()} data={chartData} />

      <div className="flex">
        <span className="pt-2">Distance : {distance} m</span>

        <button
          className="flex ml-auto bg-blue-500 hover:bg-blue-700 text-black dark:text-white border font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
          onClick={() => downloadCsv(id)}
        >
          Export Walk
        </button>
      </div>

      <div>First event : {fetchedWalkData?.[0]?.time}</div>
      <div>
        Last Event : {fetchedWalkData?.[fetchedWalkData?.length - 1]?.time}
      </div>
      <div>Current Event : {currentTimeStamp}</div>
      <div>Beacon Data : {beaconDetail}</div>
    </>
  );
};

export default BeaconReplay;
