/* eslint-disable no-eval */
import { useState, createRef } from 'react';
import { JpegClient } from './JpegClient';

const blockItems = {
  display: 'block',
  margin: '10px auto',
};

const jpeg = new JpegClient();

function App() {
  const image = createRef();

  const [data, setData] = useState('');
  const [imageSrc, setImageSrc] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      console.log('Result', reader.result);

      const buffer = new Uint8Array(reader.result);

      console.log('buffer', buffer);

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

    const b64encoded = btoa(
      buffer.reduce((data, byte) => data + String.fromCharCode(byte), ''),
    );

    setImageSrc(`data:image/jpeg;base64,${b64encoded}`);
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
