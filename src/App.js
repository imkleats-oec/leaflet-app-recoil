import React from 'react';
import { makeStyles, CssBaseline, ButtonGroup } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import LeafletMap from './components/LeafletMap/LeafletMap';
import ProviderLayerSwitch from './components/MarkerLayerSwitch/MarkerLayerSwitch';
import './App.css';
import GeoLayerSwitch from './components/GeoLayerSwitch/GeoLayerSwitch';

const useStyles = makeStyles((theme) => ({
  paper: {
    height: 'calc(100vh - 64px)',
    display: 'flex',
    paddingBottom: '100px',
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  mapContainer: {
    height: 'calc(100vh - 64px)',
  },
}));

function App() {
  const classes = useStyles();
  return (
    <>
    <CssBaseline />
    <Paper id="mainBox" square className={classes.paper}>
      <LeafletMap name="map" />
    </Paper>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
          <ProviderLayerSwitch id="funny" />
          
          <ButtonGroup color="default" variant="contained"
            aria-label="contained primary button group" >
            {
              ["tracts","cousub","county"].map(
                layerId => <GeoLayerSwitch layerId={layerId} />
              )
            }
          </ButtonGroup>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default App;
