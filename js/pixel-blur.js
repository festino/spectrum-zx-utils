function blurImage(image) {
    let bytesPerPixel = getBytesPerPixel(image);
    let resImage = new ImageData(
        new Uint8ClampedArray(image.width * image.height * bytesPerPixel),
        image.width,
        image.height
    );
    for (let j = 0; j < image.height; j++) {
        for (let i = 0; i < image.width; i++) {
            for (let k = 0; k < bytesPerPixel; k++) {
                let color = 0;
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        let dist = Math.abs(dx) + Math.abs(dy);
                        let coef = (dist == 0 ? 4.0 : dist == 1 ? 2.0 : 1.0) / 16.0;
                        color += coef * getColorComponent(image, i + dx, j + dy, k);
                    }
                }
                resImage.data[(j * resImage.width + i) * bytesPerPixel + k] = color;
            }
        }
    }
    return resImage;
}

function getColorComponent(image, x, y, byteIndex) {
    if (x < 0) x = -x;
    else if (x >= image.width) x = image.width - (x - image.width + 2);

    if (y < 0) y = -y;
    else if (y >= image.height) y = image.height - (y - image.height + 2);

    let bytesPerPixel = getBytesPerPixel(image);
    return image.data[(y * image.width + x) * bytesPerPixel + byteIndex];
}