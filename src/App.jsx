import React, { useState, useRef, useEffect } from "react";
import ReactQRCode from "react-qr-code";
import "./App.css";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import QRCodeStyling from "qr-code-styling";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [fgColor, setFgColor] = useColor("hex", "#000000");
  const [qrSize, setQrSize] = useState("256");

  // 🔧 Use plain color object for background
  const [bgColor, setBgColor] = useState({
    hex: "#ffffff",
    hsv: { h: 0, s: 0, v: 1 },
    rgb: { r: 255, g: 255, b: 255 },
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (showColorPicker === "fg" &&
          fgColorPickerRef.current &&
          !fgColorPickerRef.current.contains(event.target) &&
          !event.target.closest(".color-dot-wrapper")) ||
        (showColorPicker === "bg" &&
          bgColorPickerRef.current &&
          !bgColorPickerRef.current.contains(event.target) &&
          !event.target.closest(".color-dot-wrapper"))
      ) {
        setShowColorPicker(null);
      }
    };
    if (showColorPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorPicker]);
  const sanitizeSize = (value) => {
    const numeric = parseInt(value.toString().replace(/[^\d]/g, ""));
    return isNaN(numeric) ? 256 : numeric; // fallback to 256 if invalid
  };

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
  const handleLogoUpload = (e) => {
    if (e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };
  return (
    <div className="App">
      <div className="edit-panel">
        <h2>Design Your QR</h2>
        <h3
          className="collapsible-header"
          onClick={() => setShowColorSection(!showColorSection)}
        >
          Color {showColorSection ? "▲" : "▼"}
        </h3>
        {showColorSection && (
          <div className="color-section">
            <div className="color-dots-container">
              <div className="color-dot-wrapper" onClick={() => toggleColorPicker("fg")}>
                <div
                  className="color-dot"
                  style={{ backgroundColor: fgColor.hex }}
                  title="Foreground Color"
                />
                <span>Foreground</span>
              </div>
              <div className="color-dot-wrapper" onClick={() => toggleColorPicker("bg")}>
                <div
                  className="color-dot"
                  style={{ backgroundColor: bgColor.hex }}
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
                  onChange={setFgColor}
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
                  onChange={setBgColor}
                  dark
                />
              </div>
            )}
          </div>
        )}
        <div className="size-input-container">
          <label
            htmlFor="qrSizeInput"
            className="size-input-label"
          >
            Size
          </label>
          <input
            id="qrSizeInput"
            type="text"
            value={qrSize}
            onChange={(e) => setQrSize(e.target.value.replace(/[^\dpx]/g, ""))}
            className="size-input-field"
            placeholder="256"
          />
        </div>
        <div className="size-input-container">
          <label
            htmlFor="qrlogoInput"
            className="size-input-label"
          >
            Upload Logo
          </label>
          <input type="file" accept="image/*"  onChange={handleLogoUpload} />
        </div>
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
              size={sanitizeSize(qrSize)}
              fgColor={fgColor.hex}
              bgColor={bgColor.hex}
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
