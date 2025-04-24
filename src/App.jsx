import React, { useState, useRef, useEffect } from "react";
import QRCodeStyling from "qr-code-styling";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import "./App.css";
import logo from "./assets/logo.png"; 


function App() {
  const [inputValue, setInputValue] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [qrSize, setQrSize] = useState("256");
  const [logoFile, setLogoFile] = useState(null);

  const [fgColor, setFgColor] = useColor("hex", "#000000");
  const [dgColor, setDgColor] = useColor("hex", "#000000");
  const [sgColor, setSgColor] = useColor("hex", "#000000");
  const [bgColor, setBgColor] = useState({
    hex: "#ffffff",
    hsv: { h: 0, s: 0, v: 1 },
    rgb: { r: 255, g: 255, b: 255 },
  });

  const [showColorSection, setShowColorSection] = useState(false);
  const [showDotsSection, setShowDotsSection] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(null);
  const [dotShape, setDotShape] = useState("square");
  const [cornerDotShape, setCornerDotShape] = useState("square");
  const [cornerSquareShape, setCornerSquareShape] = useState("square");

  const fgColorPickerRef = useRef(null);
  const bgColorPickerRef = useRef(null);
  const dgColorPickerRef = useRef(null);
  const sgColorPickerRef = useRef(null);
  const qrRef = useRef(null);

  const qrCodeInstance = useRef(
    new QRCodeStyling({
      width: 256,
      height: 256,
      data: "",
      image: "",
      dotsOptions: {
        color: "#000000",
        type: dotShape,
      },
      cornersDotOptions: {
        color: "#000000",
        type: cornerDotShape
      },
      cornersSquareOptions: {
        color: "#000000",
        type: cornerSquareShape
      },
      backgroundOptions: {
        color: "#ffffff",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 4,
        hideBackgroundDots: true, // optional
      },
      // ✅ MOST IMPORTANT
      qrOptions: {
        errorCorrectionLevel: "H", // High error correction for logo
      },
    })
  ).current;


  const handleChange = (e) => setInputValue(e.target.value);
  const handleGenerateQRCode = () => setQrCode(inputValue);

  const handleLogoUpload = (e) => {
    if (e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const sanitizeSize = (value) => {
    const numeric = parseInt(value.toString().replace(/[^\d]/g, ""));
    return isNaN(numeric) ? 256 : numeric;
  };

  const toggleColorPicker = (type) => {
    setShowColorPicker(showColorPicker === type ? null : type);
  };

  const handleDownloadQRCode = () => {
    qrCodeInstance.download({ name: "qr_code", extension: "png" });
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
          (showColorPicker === "dg" &&
            dgColorPickerRef.current &&
            !dgColorPickerRef.current.contains(event.target) &&
            !event.target.closest(".color-dot-wrapper"))
            (showColorPicker === "sg" &&
              sgColorPickerRef.current &&
              !sgColorPickerRef.current.contains(event.target) &&
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

  useEffect(() => {
    qrCodeInstance.update({
      width: sanitizeSize(qrSize),
      height: sanitizeSize(qrSize),
      data: qrCode,
      image: logoFile ? URL.createObjectURL(logoFile) : "",
      dotsOptions: {
        color: fgColor.hex,
      },
      backgroundOptions: {
        color: bgColor.hex,
      },
      cornersDotOptions: {
        color: dgColor.hex,
      },
      cornersSquareOptions: {
        color: sgColor.hex,
      },
    });

    if (qrRef.current) {
      qrRef.current.innerHTML = "";
      qrCodeInstance.append(qrRef.current);
    }
  }, [qrCode, fgColor, bgColor,dgColor,sgColor, qrSize, logoFile]);

  return (
    <>
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
              <div className="color-dot-wrapper" onClick={() => toggleColorPicker("dg")}>
                <div
                  className="color-dot"
                  style={{ backgroundColor: dgColor.hex }}
                  title="Dot Corner"
                />
                <span>Dot Corner</span>
              </div>
              <div className="color-dot-wrapper" onClick={() => toggleColorPicker("sg")}>
                <div
                  className="color-dot"
                  style={{ backgroundColor: sgColor.hex }}
                  title="Square Corner"
                />
                <span>Square Corner</span>
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
              {showColorPicker === "dg" && (
              <div className="color-picker-popup" ref={dgColorPickerRef}>
                <ColorPicker
                  width={100}
                  height={80}
                  color={dgColor}
                  onChange={setDgColor}
                  dark
                />
              </div>
            )}
             {showColorPicker === "sg" && (
              <div className="color-picker-popup" ref={sgColorPickerRef}>
                <ColorPicker
                  width={100}
                  height={80}
                  color={sgColor}
                  onChange={setSgColor}
                  dark
                />
              </div>
            )}
          </div>
        )}
        <h3
          className="collapsible-header"
          onClick={() => setShowDotsSection(!showDotsSection)}
        >
          Dots & Corners{showDotsSection ? "▲" : "▼"}
        </h3>
        {showDotsSection && (
          <div className="color-section">
            <span>Dot Type</span>
            <select
              value={dotShape}
              onChange={(e) => {
                const selectedShape = e.target.value;
                setDotShape(selectedShape);
                qrCodeInstance.update({
                  dotsOptions: {
                    type: selectedShape,
                  },
                });
              }}
            >
              <option value="rounded">Rounded</option>
              <option value="dots">Dots</option>
              <option value="square">Square</option>
              <option value="classy">Classy</option>
              <option value="extra-rounded">Extra Rounded</option>
              <option value="classy-rounded">Classy Rounded</option>
            </select>

            <span>Corners Dot</span>
            <select
              value={cornerDotShape}
              onChange={(e) => {
                const selectedShape = e.target.value;
                setCornerDotShape(selectedShape);
                qrCodeInstance.update({
                  cornersDotOptions: {
                    type: selectedShape,
                  },
                });
              }}
            >
              <option value="dot">Dot</option>
              <option value="square">Square</option>
            </select>

            <span>Corners Square</span>
            <select
              value={cornerSquareShape}
              onChange={(e) => {
                const selectedShape = e.target.value;
                setCornerSquareShape(selectedShape);
                qrCodeInstance.update({
                  cornersSquareOptions: {
                    type: selectedShape,
                  },
                });
              }}
            >
              <option value="dot">Dot</option>
              <option value="square">Square</option>
              <option value="extra-rounded">Extra Rounded</option>
            </select>
          </div>

          
        )}
        <div className="size-input-container">
          <label htmlFor="qrSizeInput" className="size-input-label">
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

        <div className="img-input-container">
          <label htmlFor="qrlogoInput" className="size-input-label">
            Upload Logo
          </label>
          <input type="file" accept="image/*" onChange={handleLogoUpload} />
        </div>
      </div>

      <div className="qr-studio">
        <img src={logo} alt="logo" className="logo" />
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter URL, text or contact details"
        />
        <button onClick={handleGenerateQRCode}>Generate QR Code</button>

            {qrCode ? (
              <>
                <div ref={qrRef} className="qr-code-container"></div>
                <button onClick={handleDownloadQRCode} className="download">Download QR Code</button>
              </>
            ) : (
          <p>Enter text and generate a QR code</p>
        )}
      </div>
      
    </div>
    <footer className="footer">Made with ❤️ by Tanushree | <a href="https://github.com/Tanushree-jain">GitHub</a> | <a href="https://www.linkedin.com/in/tanushree-gangwal">LinkedIn</a></footer>
    </>
  );
}

export default App;
