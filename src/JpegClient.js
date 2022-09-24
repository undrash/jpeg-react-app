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
    if (!imageBuffer) {
      throw new Error(
        "Please provide a jpeg image buffer you'd like to write to.",
      );
    }

    if (!data) {
      throw new Error('Please provide data you would like to write.');
    }

    if (typeof data !== 'string' && !(data instanceof String)) {
      throw new Error('Data provided must be string.');
    }

    const array = new Uint8Array(imageBuffer);

    let hex = this.bytesToHex(array);

    hex = this.getCleanHex(hex);

    const dataHex = this.stringToHex(data);

    hex += dataHex;

    return new Uint8Array(this.hexToBytes(hex));
  }

  get(imageBuffer) {
    if (!imageBuffer) {
      throw new Error(
        "Please provide a jpeg image buffer you'd like to read from.",
      );
    }

    const array = new Uint8Array(imageBuffer);

    const hex = this.bytesToHex(array);

    const dataHex = hex.substring(
      hex.lastIndexOf(this.END_MARKER) + this.END_MARKER.length,
    );

    if (!dataHex) return '';

    const dataString = this.stringFromHex(dataHex);

    return dataString;
  }

  bufferToImgUrlSrc(imageBuffer) {
    const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL(blob);

    return imageUrl;
  }

  bufferToBase64Src(arrayBuffer) {
    const buffer = new Uint8Array(arrayBuffer);

    const b64encoded = btoa(
      buffer.reduce((data, byte) => data + String.fromCharCode(byte), ''),
    );

    return `data:image/jpeg;base64,${b64encoded}`;
  }
}
