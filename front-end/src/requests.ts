import { TokenRounded } from '@mui/icons-material';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import * as Important from "src/important";
import { AnyObject } from 'yup/lib/object';



const backEndBaseUrl = Important.backEndBaseUrl;
const accessTokenCookie = Important.accessTokenCookie;
const adminCookie = Important.adminCookie;

const axiosConfig = {
        url:'',
        headers: {
            'Authorization': '', 
            'role': '',
        },
        params: {}, 
        initializedHeaders: false
};
    
async function getRequest(requestUrl: any, params?:any) {
        try {
                if(params) 
                  axiosConfig.params = params;
                  
                const response = await axios.get(requestUrl, {
                        baseURL: axiosConfig.url,
                        headers: axiosConfig.headers,
                        params: axiosConfig.params
                });
                return response;
        } catch (error) {
                throw error;
        }
}

async function deleteRequest(requestUrl: any) {
        try {
                const response = await axios.delete(requestUrl, {
                        baseURL: axiosConfig.url,
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
                        baseURL: axiosConfig.url,
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
                        baseURL: axiosConfig.url,
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
                        baseURL: axiosConfig.url,
                        headers: axiosConfig.headers
                })
                return response;
        }catch(error){
                throw error;
        }
}

function getCookies  ()  {
        const cookies = new Cookies();
        const token = cookies.get(accessTokenCookie);
        const isAdmin = cookies.get(adminCookie);
        return {token, isAdmin};
}

const initializeHeaders = () => {
        const { token, isAdmin } = getCookies();
        axiosConfig.url = backEndBaseUrl ? `${backEndBaseUrl}` : '';
        axiosConfig.headers.Authorization = token ? `Bearer ${token}` : '';
        axiosConfig.headers.role = isAdmin ? 'admin' : 'user';
        axiosConfig.initializedHeaders = true;
};

const authGetRequest = async (requestUrl: string, params?:any) => {
        if(axiosConfig.initializedHeaders === false) 
          initializeHeaders();
        return getRequest(requestUrl, params);
}
const authDeleteRequest = async (requestUrl: string) => {
        if(axiosConfig.initializedHeaders === false) 
          initializeHeaders();
        return deleteRequest(requestUrl);
}

const authPostRequest = async (requestUrl: string, data: any) => {
        if(axiosConfig.initializedHeaders === false) 
          initializeHeaders();
        return postRequest(requestUrl, data)
}

const authPatchRequest = async (requestUrl: string, data:any) => {
        if(axiosConfig.initializedHeaders === false) 
          initializeHeaders();
        return patchRequest(requestUrl, data);
}

const authPutRequest = async (requestUrl: string, data:any) => {
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