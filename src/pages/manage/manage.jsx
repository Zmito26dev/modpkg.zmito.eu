import "./manage.css"
import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import svg from "../../assets/svg"
import ManageDialog from "../../components/manage-dialog/manage-dialog"
import Modlist from "../../components/modlist/modlist"
import logo from "/logobanner.svg"

export default function ManagePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedModsState = useState([])
  const [selectedMods, setSelectedMods] = selectedModsState
  const [loader, setLoader] = useState("fabric");
  const [allVersions, setAllVersions] = useState([]);
  const [version, setVersion] = useState("1.20.1");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const loaderRef = useRef(null)
  const versionRef = useRef(null)

  useEffect(() => {
    document.title = "MODPKG — Manage Package";
  }, []);

  function MinecraftVersions({ filterType }) {
    const filteredVersions = allVersions.filter(version => {
      if (filterType === 'release') {
        return version.type === 'release';
      } else if (filterType === 'snapshot') {
        return version.type === 'snapshot';
      }
      return true; // Default to all if no filter
    });

    const versionIds = filteredVersions.map(version => version.id);

    return versionIds.map(version => (
      <option key={version} value={version}>
        {version}
      </option>
    ));
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://piston-meta.mojang.com/mc/game/version_manifest.json');
      const data = await response.json();

      setAllVersions(data.versions);
      if (!(location.state)) {
        setVersion(data.latest.release);
      }
    };

    if (location.state) {
      const loadedJson = location.state.parsedJson

      setLoader(loadedJson.loader)
      setVersion(loadedJson.minecraftVersion)
      setSelectedMods(loadedJson.mods.modrinth)
      loaderRef.current.value = loadedJson.loader
    }

    fetchData();
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
            <select className="m-select" name="" id="" value={version} onChange={handleVersionChange} ref={versionRef}>
              <MinecraftVersions filterType={"release"}/>
            </select>
          </div>
        </div>
        <div className="m-main-group">
          <h3>Search & Filters</h3>
          <input className="m-search-input" type="search" placeholder="Search mods" onChange={handleSearchChange}/>
          <div className="m-page-selector">
            <button onClick={() => {if (page > 1) {setPage(page - 1)}}}>{svg.pageLeft}</button>
            <p>Page: {page}</p>
            <button onClick={() => setPage(page + 1)}>{svg.pageRight}</button>
          </div>
        </div>
        <ManageDialog selectedModsState={selectedModsState} loader={loader} version={version} />
      </div>
      <div className="m-modlist">
        <Modlist selectedModsState={selectedModsState} loader={loader} version={version} search={search} page={page}/>
      </div>
    </main>
  )
}