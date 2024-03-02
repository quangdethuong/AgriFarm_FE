import { diseaseDiagnosticDef } from '@/app/[locale]/(Dashboard)/(Disease)/diagnostic-add/model/diseaseDiagnosticModel';
import { AxiosInstance } from 'axios';

const diseaseDiagnosesAddApi = async (
    http: AxiosInstance | null,
    data : diseaseDiagnosticDef) => {
    try {
        const response = await http?.post('/disease/disease-diagnoses/add', {
            plantDiseaseId: data.plantDiseaseId,
            description: data.description,
            feedback: data.feedback,
            location: data.location,
            createBy: data.createBy,
            // landId: data.landId
        });

        return response?.data;
    } catch (error: unknown) {
        // Assert the type of error to be an instance of Error
        if (error instanceof Error) {
            throw new Error(`Error calling API: ${error.message}`);
        } else {
            throw new Error(`Unknown error occurred: ${error}`);
        }
    }
};
export default diseaseDiagnosesAddApi;
