import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./modlist.css"
import svg from "../../assets/svg";
import dlmod from "../../functions/dlmod";

export default function Modlist({selectedModsState, loader, version, search}) {
  const [mods, setMods] = useState([])
  const [selectedMods, setSelectedMods] = selectedModsState

  useEffect(() => {
    const fetchMods = async () => {
      const facets = [
        [`categories:${loader}`],
        [`versions:${version}`],
        ['project_type:mod']
      ];

      try {
        const response = await fetch('https://api.modrinth.com/v2/search?' + new URLSearchParams({
          query: search,
          facets: JSON.stringify(facets),
          limit: 50
        }));
        const data = await response.json();
        setMods(data.hits);
        // console.log(data.hits)
      } catch (error) {
        console.error(error);
      }
    };

    fetchMods();
  }, [search, version, loader]);

  const handleSelect = (mod) => {
    setSelectedMods(prevSelectedMods => {
      const isSelected = prevSelectedMods.some(selectedMod => selectedMod.id === mod.id);
      return isSelected
        ? prevSelectedMods.filter(selectedMod => selectedMod.id !== mod.id)
        : [...prevSelectedMods, mod];
    });
  };

  const ModCard = ({provider, url, id, name, icon, desc}) => {
    const isSelected = selectedMods.some(mod => mod.id === id);

    return (
      <div className="modcard" animate={{ opacity: 1 }} transition={{ duration: 0.1 }}>
        <div className="mc-main">
          <img src={icon} alt="" />
          <div className="mc-info">
            <a href={url} target="_blank"><h3>{name}</h3></a>
            <p>{desc}</p>
          </div>
        </div>
        <div className="mc-options">
          <div className="mc-buttons">
            <button className="mc-button mc-dl" onClick={() => dlmod(provider, id, loader, version)} >{svg.download}<p>Download</p></button>
            <button onClick={() => handleSelect({ id, name, icon })} className={isSelected ? "mc-button mc-add" : "mc-button"}>
              {isSelected ? svg.selected : svg.select}
              {isSelected ? <p>Mod added</p> : <p>Add to packaging</p>}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modlist">
      {mods.map(mod => (
        <ModCard
          key={mod.slug}
          provider={"modrinth"}
          url={`https://modrinth.com/mod/${mod.slug}`}
          id={mod.slug}
          name={mod.title}
          icon={mod.icon_url}
          desc={mod.description}
        />
      ))}
    </div>
  )
}