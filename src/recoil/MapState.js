import {atom, selector, atomFamily, selectorFamily} from 'recoil';
import L from 'leaflet';
import tract from '../geojson/tract.json';
import cousub from '../geojson/cousub.json';
import county from '../geojson/county.json';

const geographies = [
    {label: 'TRACT', id: 'tracts', payload: tract},
    {label: 'COMMUNITY', id: 'cousub', payload: cousub},
    {label: 'COUNTY', id: 'county', payload: county},
];
// import { useEffect } from 'react';

// Leaflet Root Application

const leafletApp = atomFamily({
    key: 'leafletApp',
    default: {
        leafletAppInitialized: false
    }
});

const initializeLeafletApp = selectorFamily({
    key: 'initializeLeafletApp',
    get: appId => ({get}) => get(leafletApp(appId)).leafletAppInitialized,
    set: appId => ({get, set}, leafletAppConfig) => {
        if (!get(leafletApp(appId)).leafletAppInitialized){
            // Initialize map & base layer
            set(initializeContainer(appId));
            set(initializeLeafletControl('legend'), {
                position: 'topright',
                className: 'info legend'
            });
            // Initialize geojson layers
            geographies.forEach(layer => {
                set(initializeGeoLayer(layer.id), {
                    payload: layer.payload,
                    config: {}
                });
            });
            // Initialize map coloring metrics
            // Initialize marker layers
            set(leafletApp(appId), prev => ({...prev, leafletAppInitialized: true}));
        }
    }
})

// Map State

const leafletMap = atom({
    key: 'leafletMap',
    default: null,
    dangerouslyAllowMutability: true
});

const mapContainer = atom({
    key: 'mapContainer',
    default: {
        containerInitialized: false,
        container: 'map'
    },
});

const initializeMap = selector({
    key: 'initializeMap',
    get: ({get}) => get(leafletMap),
    set: ({get, set}, leafletMapConfig) => {
        const container = get(mapContainer);
        if (container.containerInitialized) {
            set(leafletMap, L.map('map', {
                center: leafletMapConfig?.center || [39.0, -105.0],
                zoom: leafletMapConfig?.zoom || 7,
                layers: [
                    L.tileLayer(
                        leafletMapConfig?.layer?.url || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
                        {
                        attribution: leafletMapConfig?.layer?.attribution || '&copy; OpenStreetMap contributors'
                    }),
                ]
            }));
        }
    }
});

const initializeContainer = selectorFamily({
    key: 'initializeContainer',
    get: ({get}) => get(mapContainer).containerInitialized,
    set: mapDivId => ({get, set}) => {
        if (!get(mapContainer).containerInitialized) {
            set(mapContainer, {
                containerInitialized: true,
                container: mapDivId
            });
            set(initializeMap, {});
        }
    }
});

// GeoJSON Layers & Layer controls
const geoLayer = atomFamily({
    key: 'geoLayer',
    default: null,
    dangerouslyAllowMutability: true
})

const geoLayerStatus = atomFamily({
    key: 'geoLayerStatus',
    default: false,
});

const activeGeoLayer = atom({
    key: 'activeGeoLayer',
    default: ''
});

const toggleGeoLayerState = atomFamily({
    key: 'toggleGeoLayerState',
    default: false
});

const geoLayerSwitch = selectorFamily({
    key: 'geoLayerSwitch',
    get: layerId => ({get}) => get(toggleGeoLayerState(layerId)),
    set: layerId => ({get, set}, isActive) => {
        const layer = get(geoLayer(layerId));
        const mapEl = get(leafletMap);
        const activeLayer = get(activeGeoLayer);
        set(toggleGeoLayerState(layerId), isActive)
        if (isActive){
            if (activeLayer !== '') {
                get(geoLayer(activeLayer)).removeFrom(mapEl);
                set(toggleGeoLayerState(activeLayer), prev => !prev);
            }
            set(activeGeoLayer, layerId);
            layer.addTo(mapEl);
        } else {
            layer.removeFrom(mapEl);
            set(activeGeoLayer, '');
        }
    }
});

const initializeGeoLayer = selectorFamily({
    key: 'initializeGeoLayer',
    get: layerId => ({get}) => get(geoLayerStatus(layerId)),
    set: layerId => ({get, set}, layer) => {
        if (!get(geoLayerStatus(layerId))) {
            set(geoLayerOptions(layerId), layer.config);
            set(geoLayer(layerId),
                L.geoJSON(layer.payload, layer.config));
            set(geoLayerStatus(layerId), true);
        }
    }
});

const geoLayerOption = atomFamily({
    key: 'geoLayerOption',
    default: null,
})

const geoLayerOptions = selectorFamily({
    key: 'geoLayerConfig',
    get: layerId => ({get}) => {
        const geoLayerConfigOptions = [
            'pointToLayer', 'style', 'onEachFeature', 'filter',
            'coordsToLatLng', 'markersInheritOptions', 'pane', 'attribution'
        ];
        const options = {};
        geoLayerConfigOptions.forEach(
            option => options[option] = get(geoLayerOption({layerId, option}))
        );
        return options;
    },
    set: layerId => ({get, set}, config) => {
        for (const [option, callback] of Object.entries(config)){
            set(geoLayerOption({layerId, option}), callback({get, set}));
        }
    }
});

const testingCbAtom = atom({
    key: 'testingCbAtom',
    default: 2,
})

const testingCbSelector = selector({
    key: 'testingCbSelector',
    get: ({get}) => get(testingCbAtom),
    set: ({get, set}, cb) => cb({get, set})
})

// Marker Layers & Layer Controls

const markerLayer = atomFamily({
    key: 'markerLayer',
    default: L.marker([39.6, -105.8]),
    dangerouslyAllowMutability: true
});

const toggleMarkerState = atomFamily({
    key: 'toggleMarkerState',
    default: false
});

const markerLayerSwitch = selectorFamily({
    key: "markerLayerSwitch",
    get: ({id}) => ({get}) => get(toggleMarkerState(id)),
    set: ({id}) => ({get, set}, newToggle) => {
        const marker = get(markerLayer(id));
        const mapEl = get(leafletMap);
        set(toggleMarkerState(id), newToggle);
        if (newToggle){
            marker.addTo(mapEl);
        } else {
            marker.removeFrom(mapEl);
        }
    }
});

// Generic Leaflet Control (for Legend, info boxes, etc.)

const leafletControlBase = atomFamily({
    key: 'leafletControlBase',
    default: L.control(),
    dangerouslyAllowMutability: true,
});
const leafletControlStatus = atomFamily({
    key: 'leafletControlStatus',
    default: false
});

const leafletControlPosition = selectorFamily({
    key: 'leafletControlPosition',
    get: controlId => ({get}) => get(leafletControlBase(controlId))?.getPosition(),
    set: controlId => ({get, set}, loc) => get(leafletControlBase(controlId)).setPosition(loc),
});

const initializeLeafletControl = selectorFamily({
    key: 'initializeLeafletControl',
    get: controlId => ({get}) => get(leafletControlStatus(controlId)),
    set: controlId => ({get, set}, {position, className}) => {
        const control = get(leafletControlBase(controlId));
        set(leafletControlPosition(controlId), position || 'bottomright');

        control.onAdd = function (map) {
            const div = L.DomUtil.create('div', className || 'info');
            div.id = `leaflet-control-${controlId}`;
            div.innerHTML = "<p>Hello</p>";
            return div;
        };
        //set(leafletControlBase(controlId), control)

        get(leafletMap).addControl(control);
    }
});

export {
    leafletMap, 
    mapContainer, 
    // useLeafletMap,
    markerLayerSwitch,
    initializeMap,
    initializeContainer,
    initializeLeafletApp,
    geoLayerSwitch,
    testingCbSelector,
    testingCbAtom
}