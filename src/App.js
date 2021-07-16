import { useEffect, useRef, useState } from 'react'
import * as tt from '@tomtom-international/web-sdk-maps'
function App() {
  const [map, setMap] = useState({})
  const [longitude, setLongitude] = useState(-3.7045)
  const [latitude, setLatitude] = useState(33.339531)
  const mapElem = useRef()
  const API_KEY = 'V5DFo4X3uONIJmSWCvD24GobF5CCgGJ7'

  useEffect(() => {
    let myMap = tt.map({
      key: API_KEY,
      container: mapElem.current,
      center: [longitude, latitude],
      zoom: 14,
      stylesVisibility: {
        trafficFlow: true,
        trafficIncidents: true,
      },
    })
    setMap(myMap)
    // clean
    return () => myMap.remove()
  }, [longitude, latitude])
  return (
    <div className='container'>
      <div className='search-bar'>
        <h4>where to ?</h4>
        <input
          type='text'
          id='latitude'
          className='latitude'
          placeholder='latitude'
          onChange={(e) => setLatitude(e.target.value)}
        />
        <input
          type='text'
          id='longitude'
          className='longitude'
          placeholder='longitude'
          onChange={(e) => setLongitude(e.target.value)}
        />
      </div>
      <div ref={mapElem} className='map' />
    </div>
  )
}

export default App
