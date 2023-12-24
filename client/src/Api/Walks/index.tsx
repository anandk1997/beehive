import { QueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";

import { walksQueryKey } from "src/utils/Constants/WalkList";
import { walListError } from "src/Signals/WalkList";
import { API_URL } from "src/env";

export const fetchWalks = async (page: number, search: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/beaconList?page=${page}${search && `&search=${search}`}`,
    );
    walListError.value = "";
    return [response?.data?.beaconList, response?.data?.totalPages];
  } catch (error: any) {
    console.log("Get Beacons list Error : ", error);
    toast.error(error?.message ?? "Something went wrong!");
    walListError.value = error?.message;
    return [];
  }
};

export const deleteWalk = async (id: any, queryClient: QueryClient) => {
  try {
    await axios.delete(`${API_URL}/deleteBeacon?id=${id}`);
    toast.success(`Deleted Wallk ${id}`);
    queryClient.invalidateQueries({ queryKey: [walksQueryKey] });
  } catch (error) {
    toast.error(`Error Deleting Wallk ${id}`);
    console.log("Delete Walk Error : ", error);
  }
};
