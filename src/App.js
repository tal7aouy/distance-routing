import { useEffect, useRef, useState } from 'react'
import * as tt from '@tomtom-international/web-sdk-maps'
function App() {
  const [map, setMap] = useState({})
  const mapElem = useRef()
  const API_KEY = 'V5DFo4X3uONIJmSWCvD24GobF5CCgGJ7'
  const latitude = 34.029986
  const longitude = -5.022786
  useEffect(() => {
    let myMap = tt.map({
      key: API_KEY,
      container: mapElem.current,
      center: [longitude, latitude],
      zoom: 14,
    })
    setMap(myMap)
  }, [])
  return (
    <div className='container'>
      <div ref={mapElem} className='map'></div>
    </div>
  )
}

export default App
