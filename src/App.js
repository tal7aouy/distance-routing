import { useEffect, useRef, useState } from 'react'
import * as tt from '@tomtom-international/web-sdk-maps'
import * as tts from '@tomtom-international/web-sdk-services'
function App() {
  const [map, setMap] = useState({})
  const [longitude, setLongitude] = useState(-3.7045)
  const [latitude, setLatitude] = useState(33.339531)
  const mapElem = useRef()

  const API_KEY = 'V5DFo4X3uONIJmSWCvD24GobF5CCgGJ7'
  // convert latitude & longtitude to point
  const toPoint = (latLng) => {
    return {
      point: {
        latitude: latLng.lat,
        longitude: latLng.lng,
      },
    }
  }
  const addDeliveryMarker = (lngLat, map) => {
    const element = document.createElement('div')
    element.className = 'delivery-marker'
    new tt.Marker({
      element: element,
    })
      .setLngLat(lngLat)
      .addTo(map)
  }
  useEffect(() => {
    const origin = {
      lat: latitude,
      long: longitude,
    }
    const destinations = []
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
    // addMarker
    const addMarker = () => {
      // popupOffest
      const popupOfsset = {
        bottom: [0, -40],
      }
      // define popup
      const popup = new tt.Popup({ offset: popupOfsset }).setHTML(
        'This is me ?'
      )
      const elem = document.createElement('div')
      elem.className = 'marker'
      const marker = new tt.Marker({
        draggable: true,
        element: elem,
      })
        .setLngLat([longitude, latitude])
        .addTo(myMap)
      marker.on('dragend', () => {
        const latLng = marker.getLngLat()
        setLatitude(latLng.lat)
        setLongitude(latLng.lng)
      })
      marker.setPopup(popup).togglePopup()
    }
    addMarker()
    // const callParams = {
    //   key: API_KEY,
    //   destinations: ,
    //   origins: [toPoint(origin)]
    // }
    // return new Promise((relove,reject)=>{
    //   tts.services.matrixRouting(callParams)
    // })

    myMap.on('click', (e) => {
      destinations.push(e.lngLat)
      addDeliveryMarker(e.lngLat, myMap)
    })
    // cleanup function
    return () => myMap.remove()
  }, [longitude, latitude])
  return (
    <>
      {map && (
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
      )}
    </>
  )
}

export default App
