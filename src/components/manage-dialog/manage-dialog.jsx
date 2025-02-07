import React, {useState, useEffect} from 'react';
import {
  useFloating,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal
} from "@floating-ui/react";
import { motion, AnimatePresence } from 'framer-motion';
import "./manage-dialog.css"
import svg from '../../assets/svg';
import exportPackage from '../../functions/export-package';
import dlpackage from '../../functions/dlpackage';

export default function ManageDialog({selectedModsState, version, loader}) {
  const [selectedMods, setSelectedMods] = selectedModsState
  const [modsToDownload, setModsToDownload] = useState(0)
  const [modsDownloaded, setModsDownloaded] = useState(-1)

  const [isOpen, setIsOpen] = useState(false);
  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen
  });
  const click = useClick(context);
  const role = useRole(context);
  const dismiss = useDismiss(context, { outsidePressEvent: "mousedown" });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    role,
    dismiss
  ]);

  useEffect(() => {
    setModsToDownload(selectedMods.length)
  }, [selectedMods])

  const handleExportPackage = () => {
    if (selectedMods.length > 0) {
      exportPackage(version, loader, selectedMods, true)
    }
  };

  const ModCard = ({name, icon, onClick}) => {
    return (
      <div className="dd-modcard" onClick={onClick}>
        <img src={icon} alt={name + " icon"} />
        <div className="dd-modcard-title">
          <p>{name}</p>
          {svg.close}
        </div>
      </div>
    )
  }
  
  const handleRemove = (id) => {
    setSelectedMods((prevSelectedMods) =>
      prevSelectedMods.filter((selectedMod) => selectedMod.id !== id)
    );
  };

  const handleDownloadPackage = () => {
    if (modsDownloaded === -1) {
      dlpackage(selectedMods, setModsDownloaded, version, loader);
    }
  };

  return (
    <>
      <button ref={refs.setReference} {...getReferenceProps()} className="m-done">Manage Package</button>
      <FloatingPortal>
        <AnimatePresence>
          {isOpen && (
            <FloatingOverlay className="dd-overlay" lockScroll>
              <FloatingFocusManager context={context}>
                <motion.div 
                  initial={{ backgroundColor: "#00000000" }}
                  animate={{ backgroundColor: "#000000aa" }}
                  exit={{ backgroundColor: "#00000000" }}
                  transition={{ duration: 0.1 }}
                  className="dd-background"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    className="done-dialog"
                    ref={refs.setFloating} {...getFloatingProps()}
                  >
                    <div className="dd-title">
                      <h3>Manage Package</h3>
                      <button onClick={() => setIsOpen(!isOpen)}>{svg.close}</button>
                    </div>
                    <div className="dd-main">
                      <div className="dd-modlist">
                        <h4>Selected mods</h4>
                        {selectedMods.length === 0 ? (
                          <p className="dd-modlist-nomods">No mods selected</p>
                        ) : (
                          <div className="dd-modlist-mods">
                            {selectedMods.map(mod => (
                              <ModCard key={mod.id} name={mod.name} icon={mod.icon} onClick={() => handleRemove(mod.id)} />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="dd-options">
                        <div className="ddo-buttons">
                          <button className="ddo-button" onClick={handleExportPackage}>{svg.export}<p>Export package</p></button>
                          <button className="ddo-button" onClick={handleDownloadPackage}>{svg.download}<p>Download</p></button>
                        </div>
                        <div className="ddo-status">
                          {modsDownloaded === -1 ? (
                            <>
                              <h3>Download status</h3>
                              <p>No downloads</p>
                            </>
                          ) : (
                            <>
                              <h3>Download status</h3>
                              <p>Downloading {modsDownloaded} of {modsToDownload} mods</p>
                              <progress className="ddo-status-pbar" value={modsDownloaded} max={modsToDownload}/>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </FloatingFocusManager>
            </FloatingOverlay>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </>
  );
}