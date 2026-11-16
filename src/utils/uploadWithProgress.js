import { useCallback, useRef, useState } from 'react';

// Multipart upload with real progress. fetch() can't report upload progress in React Native,
// XMLHttpRequest can, so every big upload (story / post video) goes through here.
//   const { promise, cancel } = createUpload({ url, method, token, formData, onProgress })
//   promise → { ok, status, data }  (data = parsed JSON, or {} when the body isn't JSON)
//   cancel() → rejects with { cancelled: true }
export function createUpload({ url, method = 'POST', token, formData, onProgress }) {
  const xhr = new XMLHttpRequest();
  const promise = new Promise((resolve, reject) => {
    xhr.open(method, url);
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader('Accept', 'application/json');

    if (xhr.upload) {
      xhr.upload.onprogress = e => {
        if (e?.lengthComputable && onProgress) onProgress({ loaded: e.loaded, total: e.total, percent: Math.min(100, Math.round((e.loaded / e.total) * 100)) });
      };
    }
    xhr.onload = () => {
      let data = {};
      try { data = JSON.parse(xhr.responseText); } catch (e) { data = {}; }
      resolve({ ok: xhr.status >= 200 && xhr.status < 300, status: xhr.status, data });
    };
    xhr.onerror = () => reject({ message: 'Network error — check your connection and try again' });
    xhr.ontimeout = () => reject({ message: 'Upload timed out' });
    xhr.onabort = () => reject({ cancelled: true });
    xhr.send(formData);
  });
  return { promise, cancel: () => xhr.abort() };
}

// State for <UploadProgressModal />:  const up = useUpload();  await up.run({...});  <UploadProgressModal {...up.state} onCancel={up.cancel} />
//   run({ url, method, token, formData, show = true })  — show=false uploads without the modal (small images)
export function useUpload() {
  const [state, setState] = useState({ visible: false, percent: 0, loaded: 0, total: 0, phase: 'uploading' });
  const req = useRef(null);

  const run = useCallback(async ({ show = true, ...opts }) => {
    if (show) setState({ visible: true, percent: 0, loaded: 0, total: 0, phase: 'uploading' });
    const r = createUpload({
      ...opts,
      onProgress: p => {
        if (!show) return;
        // all bytes sent → the server is now saving / splitting the video
        setState({ visible: true, ...p, phase: p.loaded >= p.total ? 'processing' : 'uploading' });
      },
    });
    req.current = r;
    try {
      return await r.promise;
    } finally {
      req.current = null;
      setState(s => ({ ...s, visible: false }));
    }
  }, []);

  const cancel = useCallback(() => req.current?.cancel(), []);
  return { state, run, cancel };
}

export const fmtMB = b => `${(b / 1024 / 1024).toFixed(b >= 10 * 1024 * 1024 ? 0 : 1)} MB`;
