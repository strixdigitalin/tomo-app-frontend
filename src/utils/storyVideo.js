// Story video rules — same numbers as web's AddStoryModel.jsx.
// A long video is posted as several stories of up to SEGMENT_SECONDS each (the server does the
// splitting, we send SegmentSeconds with the upload).
export const SEGMENT_SECONDS = 15;
export const MAX_SEGMENTS = 8;
export const MIN_SEGMENT_SECONDS = 1;
export const STORY_VIDEO = {
  maxBytes: 100 * 1024 * 1024,
  maxDuration: SEGMENT_SECONDS * MAX_SEGMENTS, // 120 s
  exts: ['mp4', 'mov'],
};

export const fmtTime = (s = 0) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
};

export const buildSegments = duration => {
  const out = [];
  for (let s = 0; s < duration; s += SEGMENT_SECONDS) {
    const e = Math.min(s + SEGMENT_SECONDS, duration);
    if (e - s >= MIN_SEGMENT_SECONDS) out.push({ start: s, end: e });
  }
  return out;
};

const extOf = (name = '') => String(name).split('?')[0].split('.').pop().toLowerCase();

// Returns an error message, or null when the video is allowed. size in bytes, duration in seconds
// (either may be missing — then that rule is skipped; the server checks again).
export const validateStoryVideo = ({ name, size, duration }) => {
  const ext = extOf(name);
  if (ext && ext.length <= 4 && !STORY_VIDEO.exts.includes(ext)) return 'Allowed video formats: MP4, MOV';
  if (size && size > STORY_VIDEO.maxBytes) return `Video too large. Max ${STORY_VIDEO.maxBytes / 1024 / 1024} MB`;
  if (duration && duration > STORY_VIDEO.maxDuration) {
    return `Video is too long. Max ${STORY_VIDEO.maxDuration} seconds (${MAX_SEGMENTS} stories of ${SEGMENT_SECONDS}s)`;
  }
  return null;
};

// Picture for the story ring. A video URL can't be shown by <Image>, but media is on Cloudinary,
// where the same public id with a .jpg extension is the video's poster frame.
export const storyThumb = story => {
  const m = story?.media;
  if (!m) return null;
  if (story?.type === 'video' && /\/video\/upload\//.test(m)) return m.replace(/\.[a-z0-9]+(\?.*)?$/i, '.jpg');
  return m;
};
