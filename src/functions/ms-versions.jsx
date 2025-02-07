import { useEffect, useState } from "react";

export function MinecraftVersions({ filterType }) {
  const [versions, setVersions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://piston-meta.mojang.com/mc/game/version_manifest.json');
      const data = await response.json();

      let filteredVersions = [];

      if (filterType === 'release') {
        filteredVersions = data.versions.filter(version => version.type === 'release');
      } else if (filterType === 'snapshot') {
        filteredVersions = data.versions.filter(version => version.type === 'snapshot');
      }

      const versionIds = filteredVersions.map(version => version.id);
      setVersions(versionIds);
    };

    fetchData();
  }, [filterType]);

  return versions.map(version => (
    <option key={version} value={version}>
      {version}
    </option>
  ));
};