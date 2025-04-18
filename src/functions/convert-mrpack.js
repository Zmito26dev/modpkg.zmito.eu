import JSZip from "jszip";

export default async function convertMrpack(mods, overrides, packName, setModsDownloaded, setOpenDialog) {
  const zip = new JSZip();
  setModsDownloaded(0);
  let downloadedMods = 0;
  let fileName = packName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')

  try {
    for (const mod of mods) {
      const response = await fetch(mod.url);
      const blob = await response.blob();

      setModsDownloaded(downloadedMods++)
      
      zip.file(mod.filename, blob);
    }
    
    for (const [path, file] of Object.entries(overrides)) {
      zip.file(path, file);
    }

    const content = await zip.generateAsync({ type: "blob" });
    const blobUrl = URL.createObjectURL(content);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `modpkg-${fileName}.zip`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Error downloading and zipping mods:', error);
  } finally {
    setOpenDialog(false)
    setModsDownloaded(-1)
  }
}