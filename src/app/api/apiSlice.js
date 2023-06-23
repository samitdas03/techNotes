import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {setCredentials} from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:8000",
    credentials: "include",
    prepareHeaders: (headers, {getState}) => {
        const token = getState().auth.token;
        // console.log(token);
        if(token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    // args = {request url, method, body}
    // api = {signal, dispatch, getState()}
    let result = await baseQuery(args, api, extraOptions);
    if(result?.error?.status === 403) {
        console.log("sending refresh token");
        const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);
        if(refreshResult?.data) {
            api.dispatch(setCredentials(refreshResult.data.accessToken));
            result = await baseQuery(args, api, extraOptions);
        } else {
            if(refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = "Your login has expired..."
            }
            return refreshResult;
        }
    }
    return result;
}

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Note', 'User'],
    endpoints: builder => ({})
})