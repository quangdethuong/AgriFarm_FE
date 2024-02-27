import { http } from '@/utils/config';

const diseaseInfoDeleteApi = async (
    id: string
    ) => {
    try {
        const response = await http.delete('/disease/disease-info/delete', {
            params: {
                id: id
            }
        });
  
        const responseData = response.data;

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
export default diseaseInfoDeleteApi;
