import { SaveSettings, PngSaveSettings, SvgSaveSettings } from "../types/SaveSettings";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "../stores";
import { saveAsPng } from "../components/SavePanel/Savers/PngSaver";
import { saveAsSvg } from "../components/SavePanel/Savers/SvgSaver";
import { setLastSaveSettings, setIsSaving } from "../actions";

export const useFileSaveHook = () => {
  const dispatch = useDispatch()
  const lastSaveSettings = useSelector((state: Store) => state.lastSaveSettings)

  const saveLocally = (saveSettings: SaveSettings) => {
    dispatch(setLastSaveSettings(saveSettings))
    dispatch(setIsSaving(true))
  }

  const saveAgain = () => {
    saveLocally(lastSaveSettings)
  }

  return {
    saveLocally,
    saveAgain
  }
}