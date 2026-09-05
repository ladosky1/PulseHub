import { AxiosError } from "axios";

interface ErrorResponse {
    message: string;
};

export function getErrorMessage(error: unknown){
    if(error instanceof AxiosError){        
        const axiosError = error as AxiosError<ErrorResponse>;

        return(
            axiosError.response?.data?.message ?? 
            "Something went wrong. Please try again."
        );
    };

    if(error instanceof Error){
        return error.message;
    }

    return "An unexpected error occured";
}