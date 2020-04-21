import * as React from 'react'
import { SaveSettings, PngSaveSettings, SvgSaveSettings } from "../../types/SaveSettings";
import { useSelector, useDispatch } from 'react-redux';
import { Store } from '../../stores';
import { getScale } from '../../utils';
import { EntityContainer } from '../EntityContainer';
import { ConnectionContainer } from '../ConnectionContainer';
import { START_SCALE } from '../../constants';
import { saveAsSvg } from '../SavePanel/Savers/SvgSaver';
import { saveAsPng } from '../SavePanel/Savers/PngSaver';
import { setLastSaveSettings, setIsSaving } from '../../actions';

interface SaverProps {
  saveSettings: SaveSettings;
}

export const Saver = (props: SaverProps) => {
  const dispatch = useDispatch()

  const [
    scale,
    entities,
    connections,
  ] = useSelector((state: Store) => [
    getScale(state.scaleLevel),
    state.diagramEntities,
    state.diagramConnections,
  ])

  const constantScale = getScale(START_SCALE)

  const renderEntities = () => Array.from(entities.entries()).map((entity, index) => (
    <EntityContainer key={index} entityId={entity[0]} entity={entity[1]} scale={constantScale} />
  ))

  const renderConnections = () => Array.from(connections.entries()).map((connection, index) => (
    <ConnectionContainer key={index} connectionId={connection[0]} connection={connection[1]} scale={constantScale} />
  ))

  React.useEffect(() => {
    if (props.saveSettings instanceof PngSaveSettings) {
      saveAsPng(props.saveSettings.name, props.saveSettings.scale, props.saveSettings.background)
    } else if (props.saveSettings instanceof SvgSaveSettings) {
      saveAsSvg(name)
    }
    dispatch(setLastSaveSettings(props.saveSettings))
    dispatch(setIsSaving(false))
  }, [])

  return (
    <div 
      id="saver-render-container" 
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        left: "200%",
      }}>
      <svg width='100%' height='100%'>
        {renderEntities()}
        {renderConnections()}
      </svg>
    </div>
  )
}