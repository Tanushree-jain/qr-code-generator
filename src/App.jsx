import React, { useState, useRef, useEffect } from "react";
import ReactQRCode from "react-qr-code"; // Import the react-qr-code library
import "./App.css"; // Import the CSS file for styling
import { ColorPicker, useColor } from "react-color-palette"; // Import the color picker library
import "react-color-palette/css"; // Import the CSS for the color picker

function App() {
  const [inputValue, setInputValue] = useState(""); // State to hold the input value
  const [qrCode, setQrCode] = useState(""); // State to hold generated QR code URL
  const [fgColor, setFgColor] = useColor("hex", "#000000");// State to hold foreground color
  const [bgColor, setBgColor] = useColor("hex", "#ffffff");// State to hold background color

  const [showColorSection, setShowColorSection] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(null); // null, 'fg' or 'bg'
  const fgColorPickerRef = useRef(null);
  const bgColorPickerRef = useRef(null);

  // Handle input change
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  // Toggle color picker popup
  const toggleColorPicker = (type) => {
    setShowColorPicker(showColorPicker === type ? null : type);
  };

  // Close color picker if clicked outside - improved to prevent premature closing
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showColorPicker === "fg") {
        if (
          fgColorPickerRef.current &&
          !fgColorPickerRef.current.contains(event.target) &&
          !event.target.closest('.color-dot-wrapper')
        ) {
          setShowColorPicker(null);
        }
      } else if (showColorPicker === "bg") {
        if (
          bgColorPickerRef.current &&
          !bgColorPickerRef.current.contains(event.target) &&
          !event.target.closest('.color-dot-wrapper')
        ) {
          setShowColorPicker(null);
        }
      }
    };
    if (showColorPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorPicker]);

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
        <h2>Design Your QR</h2>
        <h3
          className="collapsible-header"
          onClick={() => setShowColorSection(!showColorSection)}
          style={{ cursor: "pointer", userSelect: "none" }}
        >
          Color {showColorSection ? "▲" : "▼"}
        </h3>
        {showColorSection && (
          <div className="color-section">
            <div className="color-dots-container">
              <div className="color-dot-wrapper" onClick={() => toggleColorPicker("fg")}>
                <div
                  className="color-dot"
                  style={{ backgroundColor: fgColor.hex || "#000000" }}
                  title="Foreground Color"
                />
                <span>Foreground</span>
              </div>
              <div className="color-dot-wrapper" onClick={() => toggleColorPicker("bg")}>
                <div
                  className="color-dot"
                  style={{ backgroundColor: bgColor.hex || "#ffffff" }}
                  title="Background Color"
                />
                <span>Background</span>
              </div>
            </div>
            {showColorPicker === "fg" && (
              <div className="color-picker-popup" ref={fgColorPickerRef}>
                <ColorPicker
                  width={100}
                  height={80}
                  color={fgColor}
                  onChange={(color) => {
                    setFgColor(color);
                  }}
                  hideHSV
                  dark
                />
              </div>
            )}
            {showColorPicker === "bg" && (
              <div className="color-picker-popup" ref={bgColorPickerRef}>
                <ColorPicker
                  width={100}
                  height={80}
                  color={bgColor}
                  onChange={(color) => {
                    setBgColor(color);
                  }}
                  hideHSV
                  dark
                />
              </div>
            )}
          </div>
        )}
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
            <ReactQRCode value={qrCode} size={256} bgColor={bgColor.hex || "#ffffff"} fgColor={fgColor.hex || "#000000"} />
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
