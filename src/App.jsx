import React, { useState, useRef, useEffect } from "react";
import ReactQRCode from "react-qr-code";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import "./App.css";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [fgColor, setFgColor] = useColor("hex", "#000000");
  const [bgColor, setBgColor] = useState({
    hex: "#ffffff",
    rgb: { r: 255, g: 255, b: 255 },
    hsv: { h: 0, s: 0, v: 1 },
  });

  const [showColorSection, setShowColorSection] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(null);
  const fgColorPickerRef = useRef(null);
  const bgColorPickerRef = useRef(null);

  const handleChange = (e) => setInputValue(e.target.value);
  const handleGenerateQRCode = () => setQrCode(inputValue);

  const toggleColorPicker = (type) => {
    setShowColorPicker(showColorPicker === type ? null : type);
  };

  // Close color pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (showColorPicker === "fg" &&
          fgColorPickerRef.current &&
          !fgColorPickerRef.current.contains(event.target) &&
          !event.target.closest(".color-dot")) ||
        (showColorPicker === "bg" &&
          bgColorPickerRef.current &&
          !bgColorPickerRef.current.contains(event.target) &&
          !event.target.closest(".color-dot"))
      ) {
        setShowColorPicker(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showColorPicker]);

  const handleDownloadQRCode = () => {
    const svg = document.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
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
            <div className="color-input-group">
              <label>Border:</label>
              <div
                className="color-dot"
                style={{ backgroundColor: fgColor.hex }}
                onClick={() => toggleColorPicker("fg")}
              />
              {showColorPicker === "fg" && (
                <div className="color-picker-popup" ref={fgColorPickerRef}>
                  <ColorPicker
                    color={fgColor}
                    onChange={setFgColor}
                    hideInput={["rgb", "hsv"]}
                    dark
                  />
                </div>
              )}
            </div>

            <div className="color-input-group">
              <label>Background:</label>
              <div
                className="color-dot"
                style={{ backgroundColor: bgColor.hex }}
                onClick={() => toggleColorPicker("bg")}
              />
              {showColorPicker === "bg" && (
                <div className="color-picker-popup" ref={bgColorPickerRef}>
                  <ColorPicker
                    color={bgColor}
                    onChange={setBgColor}
                    hideInput={["rgb", "hsv"]}
                    dark
                  />
                </div>
              )}
            </div>
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
            <ReactQRCode
              value={qrCode}
              size={256}
              bgColor={bgColor.hex}
              fgColor={fgColor.hex}
            />
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
