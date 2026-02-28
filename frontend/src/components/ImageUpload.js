import React, { useState, useRef } from 'react';
import './ImageUpload.css';

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      alert('Please select an image');
      return;
    }

    const formData = new FormData();
    formData.append('file', image);

    setUploading(true);
    try {
      const response = await fetch('http://localhost:5000/api/upload-image', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data);
        setImage(null);
        setPreview(null);
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      videoRef.current.srcObject = stream;
      setIsCameraOpen(true);
    } catch (error) {
      console.error('Camera error:', error);
      alert('Cannot access camera');
    }
  };

  const capturePhoto = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasRef.current.toBlob((blob) => {
      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
      setImage(file);
      setPreview(canvasRef.current.toDataURL());
      stopCamera();
    });
  };

  const stopCamera = () => {
    videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    setIsCameraOpen(false);
  };

  return (
    <section className="upload-section">
      <div className="container">
        <div className="upload-container">
          <h2>Upload Product Image</h2>
          <p className="subtitle">Take a photo or upload an image to identify and compare prices</p>

          {!isCameraOpen && !preview ? (
            <div className="upload-box">
              <div className="upload-icon">📸</div>
              <p>Drag and drop your image here or click below</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <div className="button-group">
                <button className="btn btn-primary" onClick={() => fileInputRef.current.click()}>
                  Choose File
                </button>
                <button className="btn btn-secondary" onClick={startCamera}>
                  📷 Open Camera
                </button>
              </div>
            </div>
          ) : null}

          {isCameraOpen && (
            <div className="camera-container">
              <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '8px' }}></video>
              <canvas ref={canvasRef} style={{ display: 'none' }} width={640} height={480}></canvas>
              <div className="camera-buttons">
                <button className="btn btn-primary" onClick={capturePhoto}>
                  📸 Capture
                </button>
                <button className="btn btn-secondary" onClick={stopCamera}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {preview && (
            <div className="preview-container">
              <img src={preview} alt="Preview" className="preview-image" />
              <div className="preview-buttons">
                <button className="btn btn-primary" onClick={handleUpload} disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Search Similar'}
                </button>
                <button className="btn btn-outline" onClick={() => { setPreview(null); setImage(null); }}>
                  Change Image
                </button>
              </div>
            </div>
          )}

          {result && (
            <div className="result-box">
              <h3>✅ Product Detected</h3>
              <p className="detected-product">{result.detected_product}</p>
              <p className="result-text">Searching for prices across platforms...</p>
              <button className="btn btn-primary" onClick={() => { setResult(null); setPreview(null); setImage(null); }}>
                Search Another
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ImageUpload;