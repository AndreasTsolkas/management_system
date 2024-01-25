import { TokenRounded } from '@mui/icons-material';
import axios from 'axios';
import { useCookies } from "react-cookie";
import * as Important from "src/important";

const [cookies] = useCookies();

const backEndBaseUrl = Important.backEndBaseUrl;
const accessTokenCookie = Important.accessTokenCookie;
const adminCookie = Important.adminCookie;

const axiosConfig = {
        url:'',
        headers: {
            'Authorization': '', 
            'role': '',
        },
        initializedHeaders: false
};
    
async function getRequest(requestUrl: any) {
        try {
                const response = await axios.get(requestUrl, {
                        baseURL: backEndBaseUrl,
                        headers: axiosConfig.headers
                });
                return response;
        } catch (error) {
                throw error;
        }
}

async function deleteRequest(requestUrl: any) {
        try {
                const response = await axios.delete(requestUrl, {
                        baseURL: backEndBaseUrl,
                        headers: axiosConfig.headers
                });
                return response;
        } catch (error) {
                throw error;
        }
}

async function postRequest(requestUrl: any, data: any){
        try{
                const response = await axios.post(`${requestUrl}`, data, {
                        baseURL: backEndBaseUrl,
                        headers: axiosConfig.headers
                });
                return response;
        } catch(error){
                throw error;
        }
}

async function patchRequest(requestUrl: any, data: any){
        try{
                const response = await axios.patch(`${requestUrl}`, data, {
                        baseURL: backEndBaseUrl,
                        headers: axiosConfig.headers
                })
                return response;
        }catch(error){
                throw error;
        }
}

async function putRequest(requestUrl: any, data: any){
        try{
                const response = await axios.put(`${requestUrl}`, data, {
                        baseURL: backEndBaseUrl,
                        headers: axiosConfig.headers
                })
                return response;
        }catch(error){
                throw error;
        }
}

const getCookies = () => {
        const token = cookies[accessTokenCookie];
        const isAdmin = cookies[adminCookie];
        return {token, isAdmin};
}

const initializeHeaders = () => {
        const { token, isAdmin } = getCookies();
        axiosConfig.url = backEndBaseUrl ? `${backEndBaseUrl}` : '';
        axiosConfig.headers.Authorization = token ? `Bearer ${token}` : '';
        axiosConfig.headers.role = isAdmin ? 'admin' : 'user';
        axiosConfig.initializedHeaders = true;
};

const authGetRequest = (requestUrl: string) => {
        if(axiosConfig.initializedHeaders === false) 
          initializeHeaders();
        return getRequest(requestUrl);
}
const authDeleteRequest = (requestUrl: string) => {
        if(axiosConfig.initializedHeaders === false) 
          initializeHeaders();
        return deleteRequest(requestUrl);
}

const authPostRequest = (requestUrl: string, data: any) => {
        if(axiosConfig.initializedHeaders === false) 
          initializeHeaders();
        return postRequest(requestUrl, data)
}

const authPatchRequest = (requestUrl: string, data:any) => {
        if(axiosConfig.initializedHeaders === false) 
          initializeHeaders();
        return patchRequest(requestUrl, data);
}

const authPutRequest = (requestUrl: string, data:any) => {
        if(axiosConfig.initializedHeaders === false) 
          initializeHeaders();
        return putRequest(requestUrl, data);
}



export const httpClient = {
        get: authGetRequest,
        post: authPostRequest,
        patch: authPatchRequest,
        put: authPutRequest, 
        delete: authDeleteRequest,
}