
import { Seed } from "@/app/[locale]/(Dashboard)/(Admin)/seed/models/seed-models";
import HttpResponseCommon from "@/types/response";
import { AxiosInstance } from "axios";

export interface Pagination {
    CurrentPage: number;
    PageSize: number;
    TotalCount: number;
    TotalPages: number;
  }

const getSeedsApi: (
    siteId?: string | null,
    http?: AxiosInstance | null
    ) => Promise<HttpResponseCommon<Seed[]>> = async (siteId, http) => {
    try {
        const res = await http?.get(`/seed/farm-seeds/get`, {
            params: {
              siteId: siteId
            }, headers: {
                pageSize: 40
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
export default getSeedsApi;