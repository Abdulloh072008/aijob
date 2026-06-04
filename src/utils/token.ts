import axios from "axios";

export function saveToken(token: string) {
    localStorage.setItem("store_token", token);
}
export const getToken = () => {
    return localStorage.getItem("store_token");
};

export const axiosRequest = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    
});

axiosRequest.interceptors.request.use(
    (config) => {
        const token = getToken();

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);
console.log(import.meta.env.VITE_API_URL)





