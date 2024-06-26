
import { Fertilizer } from "@/app/[locale]/(Dashboard)/(Admin)/fertilizer/models/fertilizer-models";
import HttpResponseCommon from "@/types/response";
import { AxiosInstance } from "axios";

export interface Pagination {
    CurrentPage: number;
    PageSize: number;
    TotalCount: number;
    TotalPages: number;
  }

const getFertilizerDetailApi: (
    fertilizerId?: string | null,
    http?: AxiosInstance | null
    ) => Promise<HttpResponseCommon<Fertilizer>> = async (fertilizerId, http) => {
    try {
        const res = await http?.get(`/material/farm-fertilizers/get`, {
            params: {
              id: fertilizerId
            }
        });
        return res?.data;

    } catch (error: unknown) {
        // Assert the type of error to be an instance of Error
        if (error instanceof Error) {
            throw new Error(`Error calling API: ${error.message}`);
        } else {
            throw new Error(`Unknown error occurred: ${error}`);
        }
    }
}
export default getFertilizerDetailApi;