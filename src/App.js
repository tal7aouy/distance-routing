import { useEffect, useRef, useState } from 'react'
import * as tt from '@tomtom-international/web-sdk-maps'
import * as tts from '@tomtom-international/web-sdk-services'
function App() {
  const [map, setMap] = useState({})
  const [longitude, setLongitude] = useState(-0.127758)
  const [latitude, setLatitude] = useState(51.507351)
  const mapElem = useRef()

  const API_KEY = 'V5DFo4X3uONIJmSWCvD24GobF5CCgGJ7'
  // convert latitude & longtitude to point
  const toPoint = (lngLat) => {
    return {
      point: {
        latitude: lngLat.lat,
        longitude: lngLat.lng,
      },
    }
  }
  const drawRoute = (geoJson, map) => {
    if (map.getLayer('route')) {
      map.removeLayer('route')
      map.removeSource('route')
    }
    map.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: geoJson,
      },
      paint: {
        'line-color': 'brown',
        'line-width': 6,
      },
    })
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
      lng: longitude,
    }
    const destinations = []
    let map = tt.map({
      key: API_KEY,
      container: mapElem.current,
      center: [longitude, latitude],
      zoom: 14,
      stylesVisibility: {
        trafficFlow: true,
        trafficIncidents: true,
      },
    })
    setMap(map)
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
        .addTo(map)
      marker.on('dragend', () => {
        const latLng = marker.getLngLat()
        setLatitude(latLng.lat)
        setLongitude(latLng.lng)
      })
      marker.setPopup(popup).togglePopup()
    }
    addMarker()

    const sortDests = (locations) => {
      const pointsForDes = locations.map((destination) => {
        return toPoint(destination)
      })
      const callParams = {
        key: API_KEY,
        destinations: pointsForDes,
        origins: [toPoint(origin)],
      }
      return new Promise((resolve, reject) => {
        tts.services.matrixRouting(callParams).then((response) => {
          const results = response.matrix[0]
          console.log(results)

          const arrayResults = results.map((result, index) => {
            return {
              location: locations[index],
              drivingtime: result.response.routeSummary.travelTimeInSeconds,
            }
          })
          arrayResults.sort((x, y) => {
            return x.drivingtime - y.drivingtime
          })
          const sortedLocations = arrayResults.map((result) => {
            return result.location
          })
          resolve(sortedLocations)
        })
      })
    }
    const recalculateRoutes = () => {
      sortDests(destinations).then((sorted) => {
        sorted.unshift(origin)
        tts.services
          .calculateRoute({
            key: API_KEY,
            locations: sorted,
          })
          .then((routeData) => {
            const geoJson = routeData.toGeoJson()

            drawRoute(geoJson, map)
          })
      })
    }
    map.on('click', (e) => {
      destinations.push(e.lngLat)
      addDeliveryMarker(e.lngLat, map)
      recalculateRoutes()
    })
    // cleanup function
    return () => map.remove()
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
