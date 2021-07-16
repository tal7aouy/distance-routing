import { useEffect, useRef, useState } from 'react'
import * as tt from '@tomtom-international/web-sdk-maps'
function App() {
  const [map, setMap] = useState({})
  const mapElem = useRef()
  const API_KEY = 'V5DFo4X3uONIJmSWCvD24GobF5CCgGJ7'
  useEffect(() => {
    let myMap = tt.map({
      key: API_KEY,
      container: mapElem.current,
    })
    console.log(myMap)
    setMap(myMap)
  }, [])
  return (
    <div className='container'>
      <div ref={mapElem} className='map'></div>
    </div>
  )
}

export default App
