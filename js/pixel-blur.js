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
                        color += coef * getColor(image, i + dx, j + dy, k);
                    }
                }
                resImage.data[(j * resImage.width + i) * bytesPerPixel + k] = color
            }
        }
    }
    return resImage;
}

function getColor(image, x, y, byteIndex) {
    if (x < 0) x = image.width - 1;
    else if (x >= image.width) x = 0;

    if (y < 0) y = image.height - 1;
    else if (y >= image.height) y = 0;

    let bytesPerPixel = getBytesPerPixel(image);
    return image.data[(y * image.width + x) * bytesPerPixel + byteIndex];
}