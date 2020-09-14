import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import './LeafletMap.css';
import { initializeLeafletApp } from '../../recoil/MapState';

export default function LeafletMap({ name }) {
    const initialize = useSetRecoilState(initializeLeafletApp(name));
    useEffect(() => initialize());
    return <div id={name} />;
}