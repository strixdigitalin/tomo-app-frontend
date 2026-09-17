import axios from 'axios';
import { getItem } from './Apis';

// Verified live on production (2026-09-17): CreateGroup/GetAllMyGroups and
// the socket.io handshake both work against the deployed backend, so Group
// Chat now talks to the same backend as the rest of the app — this was
// previously pointed at the local dev backend (10.0.2.2:8080), which is why
// web (already on production) and mobile showed different group/chat data
// under the same login: two different databases, not a display bug.
export const GROUP_BASE_URL = 'https://tomo-backend-app.vercel.app';

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
        throw { message: 'Network error — check the local backend is running and reachable', msg: 'Network Error' };
    }
}

export const groupApiGet = (endPoint, data) => groupReq(endPoint, data, 'get');
export const groupApiPost = (endPoint, data) => groupReq(endPoint, data, 'post');
export const groupApiPut = (endPoint, data) => groupReq(endPoint, data, 'put');
export const groupApiDelete = (endPoint, data) => groupReq(endPoint, data, 'delete');

export async function groupApiPostFormData(endPoint, formData) {
    const token = await getItem('token');
    const response = await fetch(GROUP_BASE_URL + endPoint, {
        method: 'POST',
        headers: { Authorization: token ? `Bearer ${token}` : '' },
        body: formData,
    });
    return response.json();
}
