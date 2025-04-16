export const baseUrl = "http://localhost:5000/api";

export const postRequest = async(url, body) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body,
        });

        const data = await response.json();

        if (!response.ok) {
            let message;

            if (data?.message) {
                message = data.message;
            } else if (response.statusText) {
                message = `${response.status}: ${response.statusText}`;
            } else if (response.status === 404) {
                message = "The requested resource was not found.";
            } else if (response.status === 403) {
                message = "You don't have permission to access this resource.";
            } else if (response.status === 401) {
                message = "Authentication required. Please login again.";
            } else if (response.status >= 500) {
                message = "Server error. Please try again later.";
            } else {
                message = "An unexpected error occurred. Please try again.";
            }

            return { error: true, message };
        }

        return data;
    } catch (error) {
        // Handle network errors or other unexpected exceptions
        console.error("Request error:", error);
        return { 
            error: true, 
            message: "Network error. Please check your internet connection and try again."
        };
    }
};

export const getRequest = async(url) => {
    try {
        const response = await fetch(url);
        
        const data = await response.json();

        if (!response.ok) {
            let message;

            if (data?.message) {
                message = data.message;
            } else if (response.statusText) {
                message = `${response.status}: ${response.statusText}`;
            } else if (response.status === 404) {
                message = "The requested resource was not found.";
            } else if (response.status === 403) {
                message = "You don't have permission to access this resource.";
            } else if (response.status === 401) {
                message = "Authentication required. Please login again.";
            } else if (response.status >= 500) {
                message = "Server error. Please try again later.";
            } else {
                message = "An unexpected error occurred. Please try again.";
            }

            return { error: true, message };
        }

        return data;
    } catch (error) {
        // Handle network errors or other unexpected exceptions
        console.error("Request error:", error);
        return { 
            error: true, 
            message: "Network error. Please check your internet connection and try again."
        };
    }
};