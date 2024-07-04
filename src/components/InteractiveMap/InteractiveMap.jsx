import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, } from '@vis.gl/react-google-maps';
import { Flame } from 'lucide-react';
import { countrySpain_url } from '../../config/urls';
import useAPI from '../../services/UseApi';
import './InteractiveMap.scss';

const InteractiveMap = () => {
    const [selectedMarker, setSelectedMarker] = useState(null);
    const { data, loading, error } = useAPI(countrySpain_url);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const dataToDisplay = data.map((fire, index) => ({
        key: fire.acq_date + index, 
        location: {
            lat: parseFloat(fire.latitude),
            lng: parseFloat(fire.longitude),
        },
        info: `Fire detected on ${fire.acq_date} at ${fire.acq_time}`,
    }));

    const apiKey = import.meta.env.VITE_API_KEY;
    const mapID = import.meta.env.VITE_MAP_ID;

    return (
        <APIProvider apiKey={apiKey}>
            <div className="map" style={{height: "60vh", width: "80vw"}}>
                <Map
                    defaultCenter={{ lat: 40.4637, lng: 3.7038 }}
                    defaultZoom={6}
                    mapId={mapID}
                >
                    {dataToDisplay.map((fire, index) => (
                        <React.Fragment key={fire.key}>
                            <AdvancedMarker
                                position={fire.location}
                                onClick={() => setSelectedMarker(index)}
                            >
                                <Flame size={16} color="#e41111" strokeWidth={3} absoluteStrokeWidth />
                            </AdvancedMarker>
                            {selectedMarker === index && (
                                <InfoWindow
                                    position={fire.location}
                                    onCloseClick={() => setSelectedMarker(null)}
                                >
                                    <p>{fire.info}</p>
                                </InfoWindow>
                            )}
                        </React.Fragment>
                    ))}
                </Map>
            </div>
        </APIProvider>
    );
};

export default InteractiveMap;
