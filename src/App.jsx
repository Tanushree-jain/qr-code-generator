import React, { useState } from "react";
import ReactQRCode from "react-qr-code"; // Import the react-qr-code library

function App() {
  const [inputValue, setInputValue] = useState(""); // State to hold the input value
  const [qrCode, setQrCode] = useState(""); // State to hold generated QR code URL

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
    const canvas = document.querySelector("canvas"); // QRCode generates on a <canvas> element
    if (canvas) {
      const image = canvas.toDataURL("image/png"); // Convert canvas to image data URL
      const link = document.createElement("a");
      link.href = image;
      link.download = "qr_code.png";
      link.click();
    }
  };

  return (
    <div className="App">
      <h1>QR Code Generator</h1>

      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter URL, text or contact details"
        />
        <button onClick={handleGenerateQRCode}>Generate QR Code</button>
      </div>

      {qrCode && (
        <div className="qr-code-container">
          <ReactQRCode value={qrCode} size={256} />
          <button onClick={handleDownloadQRCode}>Download QR Code</button>
        </div>
      )}
    </div>
  );
}

export default App;
