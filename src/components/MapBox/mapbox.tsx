'use client';
import * as React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import useGeolocation from '@/utils/getlocaiton';
// import the mapbox-gl styles so that the map is displayed correctly

interface MapboxMapProps {
  initialOptions?: Omit<mapboxgl.MapboxOptions, 'container'>;
  onCreated?(map: mapboxgl.Map): void;
  onMapLoaded?(map: mapboxgl.Map): void;
  onMapRemoved?(): void;
}

function MapboxMap({
  initialOptions = {},
  onCreated,
  onMapLoaded,
  onMapRemoved
}: MapboxMapProps) {
  // this is where the map instance will be stored after initialization
  const [map, setMap] = React.useState<mapboxgl.Map>();
  // const [latitude, setLatitude] = React.useState<number | null>(null);
  // const [longitude, setLongitude] = React.useState<number | null>(null);
  const { latitude, longitude, error } = useGeolocation();
  // React ref to store a reference to the DOM node that will be used
  // as a required parameter `container` when initializing the mapbox-gl
  // will contain `null` by default
  const mapNode = React.useRef(null);
  // location
  // const getLocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       position => {
  //         setLatitude(position.coords.latitude);
  //         setLongitude(position.coords.longitude);
  //       },
  //       error => {
  //         console.error('Error getting geolocation:', error);
  //       }
  //     );
  //   } else {
  //     console.error('Geolocation is not supported by this browser.');
  //   }
  // };

  React.useEffect(() => {
    const node = mapNode.current;
    //getLocation();

    // if the window object is not found, that means
    // the component is rendered on the server
    // or the dom node is not initialized, then return early
    if (typeof window === 'undefined' || node === null) return;

    // otherwise, create a map instance
    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,

      style: 'mapbox://styles/mapbox/streets-v11',
      center: [longitude as number, latitude as number],
      zoom: 10,

      ...initialOptions
    });

    // save the map object to React.useState
    setMap(mapboxMap);
    if (onCreated) onCreated(mapboxMap);

    // if onMapLoaded is specified it will be called once
    // by "load" map event
    if (onMapLoaded) mapboxMap.once('load', onMapLoaded);

    return () => {
      mapboxMap.remove();
      setMap(undefined);

      if (onMapRemoved) onMapRemoved();
    };
  }, [latitude, longitude]);

  return (
    <div
      ref={mapNode}
      style={{ width: '100%', height: '100%' }}
    />
  );
}

export default MapboxMap;
