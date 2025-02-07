import { useRef } from "react"
import { useNavigate } from "react-router-dom";
import svg from "../assets/svg"

export default function ImportPackageInput() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsedJson = JSON.parse(e.target.result);
          // console.log(parsedJson);
          navigate('/manage', { state: { parsedJson } });
        } catch (error) {
          console.log('Error reading JSON:', error);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    fileInputRef.current.files = e.dataTransfer.files;
    handleFileSelect({ target: { files: e.dataTransfer.files } });
  };

  return (
    <>
      <label className="h-option" htmlFor="input-file" onDragOver={handleDragOver} onDrop={handleDrop}>{svg.import}<p>Import Package</p></label>
      <input type="file" name="" id="input-file" accept="application/JSON" hidden ref={fileInputRef} onChange={handleFileSelect} />
    </>
  )
}