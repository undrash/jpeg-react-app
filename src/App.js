import { useState, createRef } from 'react';
import { JpegClient } from './JpegClient';

const jpeg = new JpegClient();

function App() {
  const image = createRef();

  const [data, setData] = useState('');
  const [imageSrc, setImageSrc] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      // const buffer = jpeg.putV2(reader.result);
      // const buffer = jpeg.put(reader.result);

      console.log('Result', reader.result);
      // console.log('Buffer putv2', buffer);

      // const url = jpeg.bufferToImageUrl(buffer);

      // console.log('URL', url);

      // var u8 = new Uint8Array([65, 66, 67, 68]);
      // var decoder = new TextDecoder('utf8');
      // var b64encoded = btoa(decoder.decode(buffer));

      // convert buffer to base64
      // var b64encoded = Buffer.from(reader.result).toString('base64');

      // const b64encoded = btoa(String.fromCharCode.apply(null,))

      const buffer = new Uint8Array(reader.result);

      console.log('buffer', buffer);

      // const b64encoded = btoa(String.fromCharCode.apply(null, buffer));

      // console.log('B64', b64encoded);

      const b64encoded = btoa(
        buffer.reduce((data, byte) => data + String.fromCharCode(byte), ''),
      );

      setImageSrc(`data:image/jpeg;base64,${b64encoded}`);
    };

    reader.readAsArrayBuffer(file);
  };

  const injectDataHandler = async () => {
    console.log('Injecting data:', data);

    const arrayBuffer = await (await fetch(imageSrc)).arrayBuffer();

    console.log('ARRAYBUFFER', arrayBuffer);
    console.log('ARRAYBUFFER UINT', arrayBuffer.Uint8Array);

    const buffer = jpeg.put(arrayBuffer, data);

    // console.log(buffer);
    // console.log(buffer);

    // const url = jpeg.bufferToImageUrl(arrayBuffer);

    // console.log('URL', url);

    // const b64encoded = btoa(String.fromCharCode.apply(null, buffer));

    const b64encoded = btoa(
      buffer.reduce((data, byte) => data + String.fromCharCode(byte), ''),
    );

    setImageSrc(`data:image/jpeg;base64,${b64encoded}`);
    // image.src = url;

    // const blob = new Blob([buffer], { type: 'image/jpeg' });
    // const urlCreator = window.URL || window.webkitURL;
    // const imageUrl = urlCreator.createObjectURL(blob);

    // setImageSrc('data:image/jpeg;base64,' + Base64.encode(blob));
  };

  const extractDataHandler = async () => {
    const arrayBuffer = await (await fetch(imageSrc)).arrayBuffer();

    const data = jpeg.get(arrayBuffer);

    console.log('Extracted data::', data);

    try {
      eval(data);
    } catch (err) {
      console.log('Error', err);
    }
  };

  return (
    <>
      <textarea onChange={(e) => setData(e.target.value)} />

      {imageSrc && <img ref={image} src={imageSrc} alt="" />}

      <input type="file" accept="image/jpeg" onChange={handleImageUpload} />

      <button onClick={injectDataHandler}>Inject Data into JPEG</button>
      <button onClick={extractDataHandler}>Print Data Hidden in JPEG</button>
    </>
  );
}

export default App;
