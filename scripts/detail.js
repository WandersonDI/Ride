const params = new URLSearchParams(window.location.search)
const rideID = params.get("id")
const ride = getRideRecord(rideID);
console.log(ride)

    document.addEventListener("DOMContentLoaded", async ()=>{


        const firstPosition = ride.data[0]
      const firstLocationData = await getLocationData(firstPosition.latitude, firstPosition.longitude)

    const dataElement = document.createElement("div")
    dataElement.className = "flex-fill d-flex flex-column"

    const cityDiv = document.createElement("div")
    cityDiv.innerText = `${firstLocationData.city}-${firstLocationData.countryCode}`
    cityDiv.className = "text-danger"

    const maxSpeedDiv = document.createElement("div")
    maxSpeedDiv.innerText = `Max-Velocidade: ${getMaxSpeed(ride.data)} KM/h`

    const distanceDiv = document.createElement("div")
    distanceDiv.innerText = `Distancia-percorrida: ${getDistance(ride.data)}`

    const durationDiv = document.createElement("div")
    durationDiv.innerText = `Duração: ${getDuration(ride)}`

    const dateDiv = document.createElement("div")
    dateDiv.innerText = getStartDate(ride)
    dateDiv.className = "text-secondary mt-2"
    

    dataElement.appendChild(cityDiv)
    dataElement.appendChild(maxSpeedDiv)
    dataElement.appendChild(distanceDiv)
    dataElement.appendChild(durationDiv)
    dataElement.appendChild(dateDiv)
  
    document.querySelector("#data").appendChild(dataElement)
    
    const deleteButton = document.querySelector("#deleteBtn")
    deleteButton.addEventListener("click", ()=>{
        deleteRide(rideID)
        window.location.href = "../"
    })

    const map =  L.map("mapDetail")

    map.setView([firstPosition.latitude,firstPosition.longitude], 17)
    
    L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
	maxZoom: 20,
	attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    const positionArray = ride.data.map((position)=>{
        return [ position.latitude, position.longitude]
    })

    const polyline = L.polyline(positionArray,{color:"#F00"});
    polyline.addTo(map)

    map.fitBounds(polyline.getBounds())

    })

    