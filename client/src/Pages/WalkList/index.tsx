import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BsStopCircle } from "react-icons/bs";
import { FaTrash } from "react-icons/fa6";
import { BiExport } from "react-icons/bi";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import toast from "react-hot-toast";
import { useMemo } from "react";
import moment from "moment";

import { searchedValue, page, walListError } from "src/Signals/WalkList";
import { walksQueryKey } from "src/utils/Constants/WalkList";
import { Pagination } from "src/components/Pagination";
import { deleteWalk, fetchWalks } from "src/Api/Walks";
import { ReplayIcon, ViewIcon } from "src/assets/Svg";
import { downloadCsv } from "src/Api/ReplayWalks";
import { Loader } from "src/components/Loader";
import { socket } from "src/utils/Socket";

const BeaconList = () => {
  const queryClient = useQueryClient();

  const {
    isPending,
    error,
    data: walks,
  } = useQuery({
    queryKey: [walksQueryKey, page.value, searchedValue.value],
    queryFn: () => fetchWalks(page.value, searchedValue.value),
  });

  socket.on("connect", () => console.log("Connected to the server"));

  socket.emit("clientData", { key: "value" });

  socket.on("serverResponse", (res) =>
    console.log("Received response from server:", res),
  );

  socket.on("disconnect", () => console.log("Disconnected from the server"));

  useMemo(() => {
    socket.on("reloadList", () => {
      queryClient.invalidateQueries({ queryKey: [walksQueryKey] });
    });
  }, []);

  if (error) toast.error(error.message);
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Activity List
      </h4>

      <div className="max-w-full overflow-x-auto">
        {isPending ? (
          <Loader />
        ) : (
          <>
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Walk ID
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Device ID
                  </th>

                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Time
                  </th>

                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Status
                  </th>

                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {walks?.[0]?.map((activity: any, i: number) => (
                  <tr key={i}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {activity?.walk}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {activity?.device_id}
                      </p>
                    </td>

                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {moment(activity?.createdAt).format(
                          "DD-MM-YYYY HH:mm:ss",
                        )}
                      </p>
                    </td>

                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p
                        className={`inline-flex rounded-full ${
                          activity?.status
                            ? "bg-warning text-warning"
                            : "bg-success text-success"
                        } bg-opacity-10 py-1 px-3 text-sm font-medium`}
                      >
                        {activity?.status ? "Active" : "Completed"}
                      </p>
                    </td>

                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        {activity?.status ? (
                          <>
                            <Link to={`/beacon/${activity?.walk}`} id="view">
                              <button
                                className="hover:text-boxdark dark:hover:text-success"
                                onClick={() =>
                                  socket.emit("join_room", activity?.walk)
                                }
                              >
                                <ViewIcon />
                              </button>
                            </Link>
                            <Tooltip
                              anchorSelect="#view"
                              content="View Live Walk"
                            />

                            <button
                              className="hover:text-meta-1"
                              onClick={() =>
                                window.confirm(
                                  "Are you sure you want to Stop this walk?",
                                ) &&
                                socket.emit("forceDisconnect", activity?.walk)
                              }
                              id="stop"
                            >
                              <BsStopCircle />
                              <Tooltip
                                anchorSelect="#stop"
                                content="Stop Walk"
                              />
                            </button>
                          </>
                        ) : (
                          <>
                            <Link
                              to={`/beacon-replay/${activity?.walk}`}
                              id="replay"
                            >
                              <button className="hover:text-boxdark dark:hover:text-success mt-2">
                                <ReplayIcon />
                                <Tooltip
                                  anchorSelect="#replay"
                                  content="Replay Walk"
                                />
                              </button>
                            </Link>

                            <button
                              className="hover:text-boxdark dark:hover:text-success"
                              onClick={() => downloadCsv(activity?.walk)}
                              id="export"
                            >
                              <BiExport size={22} />
                              <Tooltip
                                anchorSelect="#export"
                                content="Export Walk"
                              />
                            </button>

                            <button
                              className="hover:text-meta-1"
                              id="delete"
                              onClick={() =>
                                window.confirm(
                                  "Are you sure you want to delete this walk?",
                                ) && deleteWalk(activity?.walk, queryClient)
                              }
                            >
                              <FaTrash />
                              <Tooltip
                                anchorSelect="#delete"
                                content="Delete Walk"
                              />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!!!walks?.[0]?.length && (
              <div className="text-center mt-2">
                <p className="text-gray-500 dark:text-gray-400">
                  {walListError.value || "No activity found"}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <Pagination {...{ page, walks }} />
    </div>
  );
};

export default BeaconList;
