import React from 'react';
import Button from '@material-ui/core/Button';
import { useRecoilState } from 'recoil';
import { geoLayerSwitch } from '../../recoil/MapState';

export default function GeoLayerSwitch({ layerId, ...other }){
    const [isActive, setActive] = useRecoilState(geoLayerSwitch(layerId));//useMarkerLayerSwitch(props);
    const toggleLayer = () => setActive(prev=>!prev);
    return (
      <Button
        {...other}
        color={ isActive ? "secondary" : "default"}
        onClick={toggleLayer}
        label="View Providers on Map">
        {layerId}
      </Button>
    );
}