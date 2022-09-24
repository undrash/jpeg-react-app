export class JpegClient {
  END_MARKER = 'ffd9';

  bytesToHex(bytes) {
    const hex = [];

    for (let i = 0; i < bytes.length; i++) {
      const current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
      hex.push((current >>> 4).toString(16));
      hex.push((current & 0xf).toString(16));
    }

    return hex.join('');
  }

  hexToBytes(hex) {
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.substr(i, 2), 16));
    }

    return bytes;
  }

  stringFromHex(hex) {
    let str = '';

    for (let i = 0; i < hex.length; i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }

    return str;
  }

  stringToHex(str) {
    let hex = '';

    for (let i = 0; i < str.length; i++) {
      hex += '' + str.charCodeAt(i).toString(16);
    }

    return hex;
  }

  getCleanHex(hex) {
    if (!hex) {
      throw new Error('Please provide a hex.');
    }
    return hex.substring(
      0,
      hex.lastIndexOf(this.END_MARKER) + this.END_MARKER.length,
    );
  }

  put(imageBuffer, data) {
    if (!imageBuffer || !data) {
      throw new Error(
        "Please provide a jpeg image buffer and the data you'd like to write to the image.",
      );
    }

    if (typeof data !== 'string' && !(data instanceof String)) {
      throw new Error('Data provided must be string.');
    }

    const array = new Uint8Array(imageBuffer);

    let hex = this.bytesToHex(array);

    hex = this.getCleanHex(hex);

    const dataHex = this.stringToHex(data);

    console.log('ORIGINAL HEX @ put', hex);
    console.log('INJECTING DATAHEX', dataHex);

    hex += dataHex;

    console.log('CONCATENATED HEX', hex);

    const bytes = this.hexToBytes(hex);

    const hexagain = this.bytesToHex(bytes);

    console.log('BYTES TO HEX AGAIN', hexagain);

    return new Uint8Array(this.hexToBytes(hex));
  }

  get(imageBuffer) {
    const array = new Uint8Array(imageBuffer);

    const hex = this.bytesToHex(array);

    console.log('ORIGINAL HEX @ get', hex);

    const dataHex = hex.substring(
      hex.lastIndexOf(this.END_MARKER) + this.END_MARKER.length,
    );

    console.log('EXTRACTED DATAHEX', dataHex);

    if (!dataHex) return null;

    const dataString = this.stringFromHex(dataHex);

    // return JSON.parse(dataString);

    return dataString;
  }

  bufferToImageUrl(buffer) {
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL(blob);

    return imageUrl;
  }
}
