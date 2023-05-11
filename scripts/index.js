const rideListElement = document.querySelector("#rideList");
const allRides = getAllRides();


allRides.forEach(async([id,value])=>{

    const ride = JSON.parse(value)
    ride.id = id
    console.log(ride)

    const firstPosition = ride.data[0]
    const firstLocationData = await getLocationData(firstPosition.latitude, firstPosition.longitude)
    

    const itemElement = document.createElement("li");
    itemElement.id = ride.id

    const cityDiv = document.createElement("div")
    itemElement.innerText = `${firstLocationData.city}-${firstLocationData.countryCode}`

    const maxSpeedDiv = document.createElement("div")
    maxSpeedDiv.innerText = `Max Speed: ${getMaxSpeed(ride.data)} KM/h`

    const distanceDiv = document.createElement("div")
    distanceDiv.innerText = `Distance ${getDistance(ride.data)}`


    itemElement.appendChild(cityDiv)
    itemElement.appendChild(maxSpeedDiv)
    itemElement.appendChild(distanceDiv)
    rideListElement.appendChild(itemElement)
    

})

async function getLocationData(latitude,longitude){
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`

    const response = await fetch(url)
    return await response.json()

}

function getMaxSpeed(positions){
    let maxSpeed = 0
    positions.forEach(position=>{
        if(position.speed != null && position.speed > maxSpeed){
            maxSpeed = position.speed
        }
    })

    return (maxSpeed * 3.6).toFixed(1)
}

function getDistance(positions){
    const earthRadiusKm = 6371
    let totalDistance = 0

    for(let i = 0; i < positions.length -1; i++){
        const p1 = {
            latitude:positions[i].latitude,
            longitude: positions[i].longitude
        }
        const p2 = {
            latitude:positions[i + 1].latitude,
            longitude: positions[i + 1].longitude
        }

        const deltaLatitude = (p2.latitude - p1.latitude) * Math.PI/180
        const deltaLongitude = (p2.longitude - p1.longitude) * Math.PI/180
        
        const a = Math.sin(deltaLatitude/2) *
        Math.sin(deltaLatitude/2) +
        Math.sin(deltaLongitude/2) *
        Math.sin(deltaLongitude/2) *
        Math.cos((p1.latitude) * Math.PI/180) *
        Math.cos((p2.latitude) * Math.PI/180)

        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
        const distance =  earthRadiusKm * c

        totalDistance += distance
    }

    function toRad(degree){
        degree * Math.PI / 180
    }
    return totalDistance.toFixed(2)
}