import "./manage.css"
import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { MinecraftVersions } from "../../functions/ms-versions"
import ManageDialog from "../../components/manage-dialog/manage-dialog"
import Modlist from "../../components/modlist/modlist"
import logo from "/logobanner.svg"

export default function ManagePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedModsState = useState([])
  const [selectedMods, setSelectedMods] = selectedModsState
  const [loader, setLoader] = useState("fabric");
  const [version, setVersion] = useState("1.21.4");
  const [search, setSearch] = useState("");
  const loaderRef = useRef(null)
  const versionRef = useRef(null)

  useEffect(() => {
    if (location.state) {
      const loadedJson = location.state.parsedJson

      setLoader(loadedJson.loader)
      setVersion(loadedJson.minecraftVersion)
      setSelectedMods(loadedJson.mods.modrinth)
      loaderRef.current.value = loadedJson.loader

      const newOption = document.createElement('option');
      newOption.value = loadedJson.minecraftVersion;
      newOption.text = "Imported: " + loadedJson.minecraftVersion;
      versionRef.current.add(newOption);
    }
  }, [location]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleVersionChange = (event) => {
    setVersion(event.target.value);
  };

  const handleLoaderChange = (event) => {
    setLoader(event.target.value);
  };

  return (
    <main className="manage">
      <div className="m-main">
        <motion.img
          className="m-logo"
          src={logo}
          draggable="false"
          alt="MODPKG Banner Logo"
          onClick={() => navigate("/")}
          layoutId="logo"
          whileHover={{ scale: 1.05 }}
        />
        <div className="m-main-group">
          <h3>Modloader & version</h3>
          <div className="m-mod-ver">
            <select className="m-select" name="" id="" onChange={handleLoaderChange} ref={loaderRef}>
              <option value="fabric">Fabric</option>
              <option value="forge">Forge</option>
              <option value="quilt">Quilt</option>
              <option value="neoforge">NeoForge</option>
            </select>
            <select className="m-select" name="" id="" onChange={handleVersionChange} ref={versionRef}>
              <MinecraftVersions filterType={"release"}/>
            </select>
          </div>
        </div>
        <div className="m-main-group">
          <h3>Search & Filters</h3>
          <input className="m-search-input" type="search" placeholder="Search mods" onChange={handleSearchChange}/>
        </div>
        <ManageDialog selectedModsState={selectedModsState} loader={loader} version={version} />
      </div>
      <div className="m-modlist">
        <Modlist selectedModsState={selectedModsState} loader={loader} version={version} search={search}/>
      </div>
    </main>
  )
}