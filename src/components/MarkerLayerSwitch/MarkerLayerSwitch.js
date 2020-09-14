import React from 'react';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { markerLayerSwitch } from '../../recoil/MapState';
import { useRecoilState } from 'recoil';

export default function MarkerLayerSwitch(props) {
    const [checked, setChecked] = useRecoilState(markerLayerSwitch(props.id));//useMarkerLayerSwitch(props);
    const toggleLayer = () => setChecked(prev=>!prev);
    return (
      <FormControlLabel
        control={<Switch checked={checked} onChange={toggleLayer} />}
        label="View Providers on Map"
      />
    );
}