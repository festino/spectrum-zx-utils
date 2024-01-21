// image has fields: data, width, height, bytesPerPixel

function downscaleImage(image, factor) {
    if (image.width % factor != 0) throw new Error(`width ${image.width} must be a multiple of ${factor}`);
    if (image.height % factor != 0) throw new Error(`height ${image.height} must be a multiple of ${factor}`);
    resImage = {
        data: new Uint8Array((image.width / factor) * (image.height / factor) * image.bytesPerPixel),
        width: image.width / factor,
        height: image.height / factor,
        bytesPerPixel: image.bytesPerPixel
    }
    for (let j = 0; j < resImage.height; j++) {
        for (let i = 0; i < resImage.width; i++) {
            for (let byteIndex = 0; byteIndex < resImage.bytesPerPixel; byteIndex++) {
                var color = image.data[(j * image.width * factor + i * factor) * image.bytesPerPixel + byteIndex];
                resImage.data[(j * resImage.width + i) * resImage.bytesPerPixel + byteIndex] = color;
            }
        }
    }
    return resImage;
}

function upscaleImage(image, factor) {
    resImage = {
        data: new Uint8Array((image.width * factor) * (image.height * factor) * image.bytesPerPixel),
        width: image.width * factor,
        height: image.height * factor,
        bytesPerPixel: image.bytesPerPixel
    }
    for (let j = 0; j < image.height; j++) {
        for (let i = 0; i < image.width; i++) {
            for (let byteIndex = 0; byteIndex < image.bytesPerPixel; byteIndex++) {
                var color = image.data[(j * image.width + i) * image.bytesPerPixel + byteIndex];
                for (let dy = 0; dy < factor; dy++) {
                    for (let dx = 0; dx < factor; dx++) {
                        resImage.data[((j * factor + dy) * resImage.width + i * factor + dx) * resImage.bytesPerPixel + byteIndex] = color;
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
    let color = 0;
    for (let byteIndex = 0; byteIndex < image.bytesPerPixel; byteIndex++)
        color += image.data[(y * image.width + x) * image.bytesPerPixel + byteIndex] << (8 * (image.bytesPerPixel - 1 - byteIndex));

    return color;
}