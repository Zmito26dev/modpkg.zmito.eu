import { useRef, useState } from "react"
import svg from "../../assets/svg"
import ImportMrpackDialog from "./import-mrpack-dialog";
import JSZip from "jszip";
import convertMrpack from "../../functions/convert-mrpack";
import "./import-mrpack.css"
import notification from "../../functions/notification";

export default function ImportMrpackInput() {
  const fileInputRef = useRef(null);
  const openDialogState = useState(false)
  const [openDialog, setOpenDialog] = openDialogState

  const [packName, setPackName] = useState("Not loaded")
  const [modsToDownload, setModsToDownload] = useState(0)
  const [modsDownloaded, setModsDownloaded] = useState(-1)
  const [mods, setMods] = useState({})
  const [overrides, setOverrides] = useState({})

  const handlePackConvertion = () => {
    if (modsDownloaded === -1) {
      convertMrpack(mods, overrides, packName, setModsDownloaded, setOpenDialog)
    }
  };

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
  
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".mrpack")) {
        notification.default("The selected file is not a .mrpack file")
        return;
      }

      try {
        const zip = await JSZip.loadAsync(selectedFile);

        const overrides = {};
        zip.folder("overrides").forEach(async (relativePath, file) => {
          const content = await file.async("blob");
          overrides[relativePath] = content;
        });

        const modrinthIndex = await zip.file('modrinth.index.json').async('text');
        const mods = JSON.parse(modrinthIndex).files.map(item => ({
          url: item.downloads[0],
          filename: item.path
        }));

        setPackName(JSON.parse(modrinthIndex).name)
        setModsToDownload(mods.length)
        setOpenDialog(true)
        setOverrides(overrides)
        setMods(mods)
      } catch (error) {
        console.log('Error reading file:', error);
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
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
      <label className="h-option" htmlFor="input-mrpack" onDragOver={handleDragOver} onDrop={handleDrop}>{svg.import}<p>Import .mrpack</p></label>
      <input type="file" name="" id="input-mrpack" accept="application/MRPACK" hidden ref={fileInputRef} onChange={handleFileSelect} />
      <ImportMrpackDialog
        openDialogState={openDialogState}
        packName={packName}
        modsToDownload={modsToDownload}
        modsDownloaded={modsDownloaded}
        handlePackConvertion={handlePackConvertion}
      />
    </>
  )
}