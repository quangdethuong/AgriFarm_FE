import { AxiosInstance } from 'axios';

const approveFromApi = async (
    http: AxiosInstance | null,
    id: any,
    ) => {
    try {
        const response = await http?.put('register/Registry/put', {
            id: id,
            decison: 1,
            notes: "ok"
        });
  
        const responseData = response?.data;

        return responseData;
    } catch (error: unknown) {
        // Assert the type of error to be an instance of Error
        if (error instanceof Error) {
            throw new Error(`Error calling API: ${error.message}`);
        } else {
            throw new Error(`Unknown error occurred: ${error}`);
        }
    }
};
export default approveFromApi;
