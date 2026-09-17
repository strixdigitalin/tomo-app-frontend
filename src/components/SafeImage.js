import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';

// Cloudinary (where our real images live) has expired, so any `uri` here can
// 404 — this falls back to a real car photo instead of a broken/blank image,
// both when there's no uri at all and when the given uri fails to load.
const CAR_PLACEHOLDER = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80';

const SafeImage = ({ uri, style, resizeMode = 'cover', ...props }) => {
    const [errored, setErrored] = useState(false);

    useEffect(() => {
        setErrored(false);
    }, [uri]);

    const source = !uri || errored ? { uri: CAR_PLACEHOLDER } : { uri };

    return (
        <Image
            source={source}
            style={style}
            resizeMode={resizeMode}
            onError={() => setErrored(true)}
            {...props}
        />
    );
};

export default SafeImage;
