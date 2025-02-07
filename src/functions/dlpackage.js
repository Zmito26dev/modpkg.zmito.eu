import JSZip from 'jszip';
import exportPackage from './export-package';

export default async function dlpackage(selectedMods, setDownloadedMods, version, loader) {
  const zip = new JSZip();
  const selectedModIds = selectedMods.map(mod => mod.id);
  console.log("Downloading mods:", selectedModIds);
  
  let downloadedMods = 0;
  setDownloadedMods(0);

  try {
    const packageJson = await exportPackage(version, loader, selectedMods, false);
    if (packageJson) {
      zip.file("package.json", JSON.stringify(packageJson, null, 2));
    }

    for (const modSlug of selectedModIds) {
      const versionsResponse = await fetch(`https://api.modrinth.com/v2/project/${modSlug}/version`);
      const versionsData = await versionsResponse.json();
      const latestVersion = versionsData.find(ver => {
        return ver.loaders.includes(loader) && ver.game_versions.includes(version);
      });
      if (latestVersion) {
        const latestFile = latestVersion.files.find(file => file.primary);

        const response = await fetch(latestFile.url);
        const blob = await response.blob();
        
        setDownloadedMods(downloadedMods++)

        zip.file(latestFile.filename, blob);
      } else {
        console.warn(`No compatible version found for mod ${modSlug}`);
      }
    }

    const content = await zip.generateAsync({ type: "blob" });
    const blobUrl = URL.createObjectURL(content);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = 'mods-package.zip';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Error downloading and zipping mods:', error);
  } finally {
    setDownloadedMods(-1);
  }
}