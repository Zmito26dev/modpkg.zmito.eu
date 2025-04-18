import React from 'react';
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
import svg from '../../assets/svg';
import "./import-mrpack.css"

export default function ImportMrpackDialog({openDialogState, packName, modsToDownload, modsDownloaded, handlePackConvertion}) {
  const [isOpen, setIsOpen] = openDialogState
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

  return (
    <FloatingPortal>
      <AnimatePresence>
        {isOpen && (
          <FloatingOverlay className="md-overlay" lockScroll>
            <FloatingFocusManager context={context}>
              <motion.div 
                initial={{ backgroundColor: "#00000000" }}
                animate={{ backgroundColor: "#000000aa" }}
                exit={{ backgroundColor: "#00000000" }}
                transition={{ duration: 0.1 }}
                className="md-background"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="mrpack-dialog"
                  ref={refs.setFloating} {...getFloatingProps()}
                >
                  <div className="md-title">
                    <h3>Convert .mrpack to Package</h3>
                    <button onClick={() => setIsOpen(!isOpen)}>{svg.close}</button>
                  </div>
                  <div className="md-main">
                    <div className="md-info">
                      <h3>Selected pack:</h3>
                      <h4>{packName}</h4>
                      <p>{modsToDownload} mods/files available for download</p>
                    </div>
                    <div className="md-options">
                      <div className="mdo-status">
                        {modsDownloaded === -1 ? (
                          <>
                            <h3>Download status</h3>
                            <p>No downloads</p>
                          </>
                        ) : (
                          <>
                            <h3>Download status</h3>
                            <p>Downloading mod/file {modsDownloaded} of {modsToDownload}.</p>
                            <progress className="ddo-status-pbar" value={modsDownloaded} max={modsToDownload}/>
                          </>
                        )}
                      </div>
                      <div className="mdo-buttons">
                        <button className="mdo-button" onClick={handlePackConvertion}>{svg.download}<p>Download</p></button>
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
  )
}