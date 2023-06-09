const rideListElement = document.querySelector("#rideList");
const allRides = getAllRides();


allRides.forEach(async([id,value])=>{

    const ride = JSON.parse(value)
    ride.id = id
    console.log(ride)

    const itemElement = document.createElement("li");
    itemElement.id = ride.id
    itemElement.className = "d-flex p1 align-items-center gap-3"
    rideListElement.appendChild(itemElement)

    itemElement.addEventListener("click", ()=>{
        window.location.href =  `../pages/detail.html?id=${ride.id}`
    })

    const firstPosition = ride.data[0]
    const firstLocationData = await getLocationData(firstPosition.latitude, firstPosition.longitude)
    
    const mapID = `map${ride.id}`
    const mapElement = document.createElement("div")
    mapElement.id = mapID
    mapElement.style = "width:120px;height:120px;"
    mapElement.classList.add("bg-primary")
    mapElement.classList.add("rounded-4")

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
    itemElement.appendChild(mapElement)
    itemElement.appendChild(dataElement)
    
    const map =  L.map(mapID, {
        zoomControl: false,
        dragging: false,
        attributionControl: false
    })

    map.setView([firstPosition.latitude,firstPosition.longitude], 17)
    
    L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
	maxZoom: 20,

    }).addTo(map)

    L.marker([firstPosition.latitude,firstPosition.longitude]).addTo(map)
})

