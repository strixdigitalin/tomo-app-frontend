import { Platform } from 'react-native';
import { BASE_URL, getItem } from './Apis';

// Shared by every chat screen (social, seller, buyer-seller) for sending a
// photo message. Uses the one generic file-upload endpoint the backend has
// (api/admin/UploadFile — no auth required, field name "Image", returns the
// Cloudinary secure_url as a plain string in `data`). NOTE: this endpoint is
// currently broken in both production and local dev — confirmed via direct
// Cloudinary API ping that the account itself is disabled ("disabled
// customer", HTTP 401) — not a code bug. This will start working the moment
// that account is reactivated; no client-side change needed then.
export async function uploadChatImage(asset) {
    const token = await getItem('token');
    const formData = new FormData();
    formData.append('Image', {
        uri: Platform.OS === 'android' ? asset.uri : asset.uri.replace('file://', ''),
        type: asset.type || 'image/jpeg',
        name: asset.fileName || `chat_${Date.now()}.jpg`,
    });

    const response = await fetch(`${BASE_URL}/api/admin/UploadFile`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });
    const result = await response.json();

    if (result?.statusCode !== 200 || !result?.data) {
        throw new Error(result?.message || 'Upload failed');
    }
    return result.data;
}

// Upload limits shared with the web app (AddPost.jsx / AddStoryModel.jsx).
export const MEDIA_RULES = {
    postImageMaxBytes: 20 * 1024 * 1024,
    postVideoMaxBytes: 500 * 1024 * 1024,
    postVideoMaxSeconds: 180,
    storyImageMaxBytes: 15 * 1024 * 1024,
};

// Returns an error message when the picked media breaks the rules, else null.
// `size` in bytes and `duration` in seconds may be undefined (then not checked).
export function validatePostMedia({ type, size, duration }) {
    if (type === 'video') {
        if (size && size > MEDIA_RULES.postVideoMaxBytes) return `Video too large. Max ${MEDIA_RULES.postVideoMaxBytes / 1024 / 1024} MB`;
        if (duration && duration > MEDIA_RULES.postVideoMaxSeconds) return `Video must be ${MEDIA_RULES.postVideoMaxSeconds} seconds or shorter`;
        return null;
    }
    if (size && size > MEDIA_RULES.postImageMaxBytes) return `File too large. Max ${MEDIA_RULES.postImageMaxBytes / 1024 / 1024} MB`;
    return null;
}
