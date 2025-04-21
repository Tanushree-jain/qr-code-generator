import React, { useState } from "react";
import ReactQRCode from "react-qr-code"; // Import the react-qr-code library
import "./App.css"; // Import the CSS file for styling
import { ColorPicker, useColor } from "react-color-palette"; // Import the color picker library
import "react-color-palette/css"; // Import the CSS for the color picker

function App() {
  const [inputValue, setInputValue] = useState(""); // State to hold the input value
  const [qrCode, setQrCode] = useState(""); // State to hold generated QR code URL
  const [fgColor, setFgColor] = useColor("hex", "#000000");// State to hold foreground color
  const [bgColor, setBgColor] = useColor("hex", "#ffffff");// State to hold background color
  // Handle input change
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  // Generate QR Code when the input value changes
  const handleGenerateQRCode = () => {
    setQrCode(inputValue);
  };

  // Download the QR code as an image
  const handleDownloadQRCode = () => {
    const svg = document.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const pngImg = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "qr_code.png";
      link.href = pngImg;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    img.src = url;
  };

  return (
    <div className="App">
      <div className="edit-panel">
        <h2>Design your QR</h2>
        <p>Foreground Color</p>
        <input
          type="text"
          value={fgColor.hex}
          onChange={setFgColor}
          placeholder="Enter URL, text or contact details"
        />
        <p>Background Color</p>
        <input
          type="text"
          value={bgColor.hex}
          onChange={setBgColor}
          placeholder="Enter URL, text or contact details"
        />
        {/* <ColorPicker color={fgColor} onChange={setFgColor} />
<ColorPicker color={bgColor} onChange={setBgColor} /> */}
      </div>
      <div className="qr-studio">
        <h1>QR Studio</h1>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter URL, text or contact details"
        />
        <button onClick={handleGenerateQRCode}>Generate QR Code</button>
        {qrCode ? (
          <>
            <ReactQRCode value={qrCode} size={256} bgColor={bgColor.hex} fgColor={fgColor.hex}/>
            <button onClick={handleDownloadQRCode}>Download QR Code</button>
          </>
        ) : (
          <p>Enter text and generate a QR code</p>
        )}
      </div>
    </div>
  );
}

export default App;
