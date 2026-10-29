import { PermissionsAndroid, Platform } from 'react-native';

const VISUAL_USER_SELECTED = 'android.permission.READ_MEDIA_VISUAL_USER_SELECTED';

// Ask for gallery access the way each Android version expects:
//   Android 13+  → READ_MEDIA_IMAGES (+ READ_MEDIA_VIDEO when videos are needed)
//   Android 14+  → also READ_MEDIA_VISUAL_USER_SELECTED (the "Select photos" partial grant)
//   Android ≤ 12 → READ_EXTERNAL_STORAGE
// iOS: the system prompt appears on the first gallery read (Info.plist has the texts).
// Returns { granted, blocked } — blocked = user chose "Don't ask again" (send them to Settings).
export async function ensureGalleryPermission({ video = false } = {}) {
  if (Platform.OS !== 'android') return { granted: true, blocked: false };

  const P = PermissionsAndroid.PERMISSIONS;
  const api = Number(Platform.Version);
  let perms;
  if (api >= 33) {
    perms = [P.READ_MEDIA_IMAGES, ...(video ? [P.READ_MEDIA_VIDEO] : [])];
    if (api >= 34) perms.push(P.READ_MEDIA_VISUAL_USER_SELECTED || VISUAL_USER_SELECTED);
  } else {
    perms = [P.READ_EXTERNAL_STORAGE];
  }

  const result = await PermissionsAndroid.requestMultiple(perms);
  const ok = p => result[p] === PermissionsAndroid.RESULTS.GRANTED;

  const full = api >= 33
    ? ok(P.READ_MEDIA_IMAGES) && (!video || ok(P.READ_MEDIA_VIDEO))
    : ok(P.READ_EXTERNAL_STORAGE);
  const partial = api >= 34 && ok(P.READ_MEDIA_VISUAL_USER_SELECTED || VISUAL_USER_SELECTED);
  const blocked = Object.values(result).some(v => v === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN);

  return { granted: full || partial, blocked: !(full || partial) && blocked };
}

// CameraRoll read that never fails just because of the optional `include` extras
// (file size / duration): if the extended call errors, retry with the basic one.
export async function getGalleryAssets(CameraRoll, params) {
  try {
    return await CameraRoll.getPhotos(params);
  } catch (error) {
    if (!params.include) throw error;
    const { include, ...basic } = params;
    return CameraRoll.getPhotos(basic);
  }
}
