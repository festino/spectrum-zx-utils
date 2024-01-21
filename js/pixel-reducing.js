// image has fields: data, width, height, bytesPerPixel

function downscaleImage(image, factor) {
    if (image.width % factor != 0) throw new Error(`width ${image.width} must be a multiple of ${factor}`);
    if (image.height % factor != 0) throw new Error(`height ${image.height} must be a multiple of ${factor}`);
    let bytesPerPixel = getBytesPerPixel(image);
    let resImage = new ImageData(
        new Uint8ClampedArray((image.width / factor) * (image.height / factor) * bytesPerPixel),
        image.width / factor,
        image.height / factor
    );
    for (let j = 0; j < resImage.height; j++) {
        for (let i = 0; i < resImage.width; i++) {
            for (let byteIndex = 0; byteIndex < bytesPerPixel; byteIndex++) {
                var color = image.data[(j * image.width * factor + i * factor) * bytesPerPixel + byteIndex];
                resImage.data[(j * resImage.width + i) * bytesPerPixel + byteIndex] = color;
            }
        }
    }
    return resImage;
}

function upscaleImage(image, factor) {
    let bytesPerPixel = getBytesPerPixel(image);
    let resImage = new ImageData(
        new Uint8ClampedArray((image.width * factor) * (image.height * factor) * bytesPerPixel),
        image.width * factor,
        image.height * factor
    );
    for (let j = 0; j < image.height; j++) {
        for (let i = 0; i < image.width; i++) {
            for (let byteIndex = 0; byteIndex < bytesPerPixel; byteIndex++) {
                var color = image.data[(j * image.width + i) * bytesPerPixel + byteIndex];
                for (let dy = 0; dy < factor; dy++) {
                    for (let dx = 0; dx < factor; dx++) {
                        resImage.data[((j * factor + dy) * resImage.width + i * factor + dx) * bytesPerPixel + byteIndex] = color;
                    }
                }
            }
        }
    }
    return resImage;
}

function getPixelSize(image) {
    let gcd = getGCD(image.width, image.height);
    if (gcd == 1) return 1;

    for (let j = 0; j < image.height; j++) {
        let color = null;
        let length = 0;
        for (let i = 0; i < image.width; i++) {
            var newColor = getColor(image, i, j);
            if (length > 0 && color == newColor) {
                length++;
                continue;
            }
            if (length > 0) {
                gcd = getGCD(length, gcd);
                if (gcd == 1) return 1;
            }
            color = newColor;
            length = 1;
        }
    }

    for (let i = 0; i < image.width; i++) {
        let color = null;
        let length = 0;
        for (let j = 0; j < image.height; j++) {
            var newColor = getColor(image, i, j);
            if (length > 0 && color == newColor) {
                length++;
                continue;
            }
            if (length > 0) {
                gcd = getGCD(length, gcd);
                if (gcd == 1) return 1;
            }
            color = newColor;
            length = 1;
        }
    }

    return gcd;
}

function getGCD(a, b) {
    while (b) {
        var t = b;
        b = a % b;
        a = t;
    }
    return a;
}

function getColor(image, x, y) {
    let bytesPerPixel = getBytesPerPixel(image);
    let color = 0;
    for (let byteIndex = 0; byteIndex < bytesPerPixel; byteIndex++) {
        color += image.data[(y * image.width + x) * bytesPerPixel + byteIndex] << (8 * (bytesPerPixel - 1 - byteIndex));
    }

    return color;
}

function getBytesPerPixel(image) {
    return image.data.length / image.width / image.height;
}