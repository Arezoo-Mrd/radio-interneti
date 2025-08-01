
import { toast } from "sonner";

export const useError = () => {
    const errorHandler = (error: any) => {
        if (error.response) {
            const errors = error.response;

            // Display all validation errors
            Object.keys(errors).forEach(field => {
                const fieldErrors = errors[field];
                if (Array.isArray(fieldErrors)) {
                    fieldErrors.forEach(errorMessage => {
                        toast.error(errorMessage);
                    });
                }
            });
        } else {
            toast.error(error.response?.data?.message || "خطا در انجام عملیات")
        }

    }

    return { errorHandler }
}