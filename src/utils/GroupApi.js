import axios from 'axios';
import { getItem, BASE_URL } from './Apis';

// Groups use the same backend as the rest of the app (and web): REST and the socket.io
// connection both go to BASE_URL.
export const GROUP_BASE_URL = BASE_URL;

async function groupHeaders() {
    const token = await getItem('token');
    return token ? { Authorization: 'Bearer ' + token } : {};
}

async function groupReq(endPoint, data, method) {
    const headers = await groupHeaders();
    try {
        const result = await axios[method](
            GROUP_BASE_URL + endPoint,
            method === 'get' || method === 'delete' ? { headers, params: data } : data,
            { headers }
        );
        return result?.data;
    } catch (error) {
        if (error?.response?.data) throw error.response.data;
        throw { message: 'Network error — please check your connection', msg: 'Network Error' };
    }
}

export const groupApiGet = (endPoint, data) => groupReq(endPoint, data, 'get');
export const groupApiPost = (endPoint, data) => groupReq(endPoint, data, 'post');
export const groupApiPut = (endPoint, data) => groupReq(endPoint, data, 'put');
export const groupApiDelete = (endPoint, data) => groupReq(endPoint, data, 'delete');

export async function groupApiPostFormData(endPoint, formData, method = 'POST') {
    const token = await getItem('token');
    const response = await fetch(GROUP_BASE_URL + endPoint, {
        method,
        headers: { Authorization: token ? `Bearer ${token}` : '' },
        body: formData,
    });
    return response.json();
}

export const groupApiPutFormData = (endPoint, formData) => groupApiPostFormData(endPoint, formData, 'PUT');
