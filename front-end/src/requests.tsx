import axios from 'axios';
import { backEndBaseUrl } from 'src/important';


async function getRequest(requestUrl: any, authToken: string | null) {
        try {
                const response = await axios.get(requestUrl, {
                        baseURL: backEndBaseUrl,
                        headers: {
                                Authorization: `Bearer ${authToken}`,
                        },
                });
                return response;
        } catch (error) {
                throw error;
        }
}

async function deleteRequest(requestUrl: any, authToken: string | null) {
        try {
                const response = await axios.delete(requestUrl, {
                        baseURL: backEndBaseUrl,
                        headers: {
                                Authorization: `Bearer ${authToken}`,
                        }
                });
                return response;
        } catch (error) {
                throw error;
        }
}

async function postRequest(requestUrl: any, data: any, authToken: string | null){
        try{
                const response = await axios.post(`${requestUrl}`, data, {
                        baseURL: backEndBaseUrl,
                        headers: {
                                //"Content-Type": "multipart/form-data",
                                Authorization: `Bearer ${authToken}`,
                        }
                });
                return response;
        } catch(error){
                throw error;
        }
}

async function patchRequest(requestUrl: any, data: any, authToken: string | null){
        try{
                const response = await axios.patch(`${requestUrl}`, data, {
                        baseURL: backEndBaseUrl,
                        headers: {
                                Authorization: `Bearer ${authToken}`,
                        }
                })
        }catch(error){
                throw error;
        }
}


const authGetRequest = (requestUrl: string) => {
        const token = localStorage.getItem('access_token');
        return getRequest(requestUrl, token);
}
const authDeleteRequest = (requestUrl: string) => {
        const token = localStorage.getItem('token');
        return deleteRequest(requestUrl, token);
}

const authPostRequest = (requestUrl: string, data: any) => {
        const token = localStorage.getItem('token');
        return postRequest(requestUrl, data, token)
}

const authPatchRequest = (requestUrl: string, data:any) => {
        const token = localStorage.getItem('token');
        return patchRequest(requestUrl, data, token);
}



export const httpClient = {
        get: authGetRequest,
        post: authPostRequest,
        patch: authPatchRequest,
        delete: authDeleteRequest,
}