/* eslint-disable no-eval */
import { useState, createRef } from 'react';
import { JpegClient } from './JpegClient';

const jpeg = new JpegClient();

function App() {
  const image = createRef();

  const [data, setData] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [consoleData, setConsoleData] = useState('');

  const getImgArrayBuffer = async () =>
    await (await fetch(imageSrc)).arrayBuffer();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const imgUrlSrc = jpeg.bufferToImgUrlSrc(reader.result);

      setImageSrc(imgUrlSrc);
    };

    reader.readAsArrayBuffer(file);
  };

  const injectDataHandler = async () => {
    if (!imageSrc) return;

    const arrayBuffer = await getImgArrayBuffer();

    const buffer = jpeg.put(arrayBuffer, data);

    const imgUrlSrc = jpeg.bufferToImgUrlSrc(buffer);

    setImageSrc(imgUrlSrc);
  };

  const extractDataHandler = async () => {
    if (!imageSrc) return;

    const arrayBuffer = await getImgArrayBuffer();

    const data = jpeg.get(arrayBuffer);

    console.log(data);

    setConsoleData(data);
  };

  const executeCodeHandler = async () => {
    if (!imageSrc) return;

    const arrayBuffer = await getImgArrayBuffer();

    const data = jpeg.get(arrayBuffer);
    try {
      eval(data);
    } catch (err) {
      console.log('Error', err);
    }
  };

  return (
    <>
      {imageSrc && (
        <>
          <div className="header">
            <img ref={image} src={imageSrc} alt="" />
            <div className="console">{consoleData}</div>
          </div>
        </>
      )}

      <textarea onChange={(e) => setData(e.target.value)} />

      <input type="file" accept="image/jpeg" onChange={handleImageUpload} />

      <button onClick={injectDataHandler}>Inject Data into JPEG</button>
      <button onClick={extractDataHandler}>Print Data Hidden in JPEG</button>
      <button onClick={executeCodeHandler}>Execute JS Hidden in JPEG</button>
    </>
  );
}

export default App;
