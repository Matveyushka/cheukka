import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSavePanelIsOpen, setLastSaveSettings, setActualVersionIsSaved } from '../../actions'
import { PngSaveSettings, SvgSaveSettings, HtmlSaveSettings, ChkSaveSettings } from '../../types/SaveSettings'
import { useFileSaveHook } from '../../hooks/fileSaverHook'

enum SaveType {
  PNG,
  SVG,
  HTML,
  CHK
}

const SaveTypeNames = {
  [SaveType.PNG]: "png",
  [SaveType.SVG]: "svg",
  [SaveType.HTML]: "html",
  [SaveType.CHK]: "chk",
}

interface SavePanelProps {

}

export const SavePanel = (props: SavePanelProps) => {
  const dispatch = useDispatch()

  const [saveType, setSaveType] = React.useState<SaveType>(SaveType.PNG)

  const nameRef = React.useRef(null)
  const backgroundRef = React.useRef(null)
  const zoomRef = React.useRef(null)

  const { saveLocally, saveAgain } = useFileSaveHook()

  return (
    <div className="save-panel">
      <button className="save-panel-close" onClick={() => dispatch(setSavePanelIsOpen(false))}>X</button>
      <div className="save-panel-header">
        <div>Saving as {SaveTypeNames[saveType]}</div>
      </div>
      <div className="save-panel-body">
        <input ref={nameRef} type="text" placeholder="Write the new file name" className="save-panel-input-name" />
        <div className="save-panel-field">
          <input 
            ref={zoomRef}
            type="number"
            defaultValue={100}
            className="save-panel-input"
            disabled={saveType !== SaveType.PNG} />
          <div className="save-panel-label">% zoom</div>
        </div>
        <div className="save-panel-field">
          <input
            ref={backgroundRef}
            type="checkbox"
            className="save-panel-input"
            disabled={saveType !== SaveType.PNG} />
          <div className="save-panel-label">white background</div>
        </div>
        <div className="save-panel-type">
          <button
            className={`save-panel-type-button${saveType === SaveType.PNG ? " save-panel-type-active" : ""}`}
            onClick={() => setSaveType(SaveType.PNG)}
          >PNG</button>
          <button
            className={`save-panel-type-button${saveType === SaveType.SVG ? " save-panel-type-active" : ""}`}
            onClick={() => setSaveType(SaveType.SVG)}
          >SVG</button>
          <button
            className={`save-panel-type-button${saveType === SaveType.HTML ? " save-panel-type-active" : ""}`}
            onClick={() => setSaveType(SaveType.HTML)}
          >HTML</button>
          <button
            className={`save-panel-type-button${saveType === SaveType.CHK ? " save-panel-type-active" : ""}`}
            onClick={() => setSaveType(SaveType.CHK)}
          >CHK</button>

        </div>
        <div className="save-panel-buttons">
          <button onClick={() => {
            const name = nameRef.current.value || "diagram"
            const scale = zoomRef.current.value
            const background = backgroundRef.current.checked

            if (saveType === SaveType.PNG) {
              saveLocally(new PngSaveSettings(name, scale, background))
            } else if (saveType === SaveType.SVG) {
              saveLocally(new SvgSaveSettings(name))
            } else if (saveType === SaveType.HTML) {
              saveLocally(new HtmlSaveSettings(name))
            } else if (saveType === SaveType.CHK) {
              saveLocally(new ChkSaveSettings(name))
            }
          }}>Save</button>
        </div>
      </div>
    </div>
  )
}