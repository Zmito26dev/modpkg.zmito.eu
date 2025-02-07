import "./home.css"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion";
import ImportPackageInput from "../../components/import-package";
import ImportMrpackInput from "../../components/import-mrpack/import-mrpack";
import logo from "/logobanner.svg"
import svg from "../../assets/svg"

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <main className="home">
      <motion.img
        className="h-logo"
        src={logo}
        draggable="false"
        alt="MODPKG Banner Logo"
        layoutId="logo"
      />
      <div className="h-mainmenu">
        <div className="h-options">
          <button className="h-option" onClick={() => navigate("/manage")}>{svg.modlist}<p>Select Mods</p></button>
        </div>
        <div className="h-options">
          <ImportPackageInput />
          <ImportMrpackInput />
        </div>
      </div>
      <a className="createdbyz" href="https://links.zmito.eu" target="_blank">
        <p>Created by </p>
        {svg.zmito}
      </a>
    </main>
  )
}