import { AxiosInstance } from 'axios';

const paymentApi = async (
    http: AxiosInstance | null,
) => {
    try {
        const response = await http?.post('/pay/payment/add', {
            paymentContent: "from AgriFarm payment",
            paymentCurrency: "VND",
            paymentRefId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            requiredAmount: 10000,
            paymentLanguage: "vi",
            merchantId: "a9f2a93d-987a-446c-b5c4-ae3dcb16cd29",
            paymentDestinationId: "12601bb5-9f8b-4fde-aa54-1c8f77cf8683",
            createdBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            signature: "none",
        });
        console.log(response);
        return response;
    } catch (error: unknown) {
        // Assert the type of error to be an instance of Error
        if (error instanceof Error) {
            throw new Error(`Error calling API: ${error.message}`);
        } else {
            throw new Error(`Unknown error occurred: ${error}`);
        }
    }
};

export default paymentApi;
