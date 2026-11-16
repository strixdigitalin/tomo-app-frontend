import { Skia, ColorType, AlphaType } from '@shopify/react-native-skia';
import jsQR from 'jsqr';

// Read a QR code out of a picked photo (no extra native module: Skia decodes the image to
// pixels and jsQR finds the code). The photo is scaled down first — phone photos are huge
// and QR codes survive downscaling fine. Returns the QR text, or null when none was found.
const SIZES = [1100, 700, 450];

const pixelsAt = (image, maxSide) => {
  const iw = image.width();
  const ih = image.height();
  const k = Math.min(1, maxSide / Math.max(iw, ih));
  const w = Math.max(1, Math.round(iw * k));
  const h = Math.max(1, Math.round(ih * k));

  const surface = Skia.Surface.MakeOffscreen(w, h);
  if (!surface) return null;
  const canvas = surface.getCanvas();
  canvas.drawColor(Skia.Color('white')); // transparent PNGs would otherwise decode as black
  canvas.drawImageRect(image, Skia.XYWHRect(0, 0, iw, ih), Skia.XYWHRect(0, 0, w, h), Skia.Paint());
  surface.flush();
  const snap = surface.makeImageSnapshot();
  const data = snap.readPixels(0, 0, { width: w, height: h, colorType: ColorType.RGBA_8888, alphaType: AlphaType.Unpremul });
  return data ? { data: new Uint8ClampedArray(data.buffer ? data : Uint8Array.from(data)), w, h } : null;
};

export async function decodeQrFromImage(uri) {
  const data = await Skia.Data.fromURI(uri);
  const image = Skia.Image.MakeImageFromEncoded(data);
  if (!image) throw new Error('Could not read this image');

  for (const size of SIZES) {
    const px = pixelsAt(image, size);
    if (!px) continue;
    const code = jsQR(px.data, px.w, px.h, { inversionAttempts: 'attemptBoth' });
    if (code?.data) return code.data;
  }
  return null;
}
