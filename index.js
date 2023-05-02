// map object
const myMap = {
	coordinates: [],
	businesses: [],
	map: {},
	markers: {},
}
let map = L.map('map').locate({setView:true, maxZoom:14});

//SD COORDS 32.716370115330164, -117.16342900854484

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// get coordinates via geolocation api

navigator.geolocation.getCurrentPosition(function (position) {
  console.log(position);
  console.log(position.coords.latitude)
  console.log(position.coords.longitude)
  let marker = L.marker([position.coords.latitude,position.coords.longitude]).addTo(map)
  .bindPopup('YOU ARE HERE!!!')
  .openPopup();
  })

// get foursquare businesses
async function getFoursquare(business) {
	const options = {
		method: 'GET',
		headers: {
		Accept: 'application/json',
		Authorization: 'fsq3ATzZbmcGhdeFafr73wZcnJ+LlN6bK+4dh19a7ClS4u8='
		}
	}
	let limit = 5
	let lat = myMap.coordinates[0]
	let lon = myMap.coordinates[1]
	let response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
	let data = await response.text()
	let parsedData = JSON.parse(data)
	let businesses = parsedData.results
	return businesses
}
// process foursquare array
function processBusinesses(data) {
	let businesses = data.map((element) => {
		let location = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return location
	})
	return businesses
}

// event handlers
window.onload = async () => {
	const coords = await getCoords()
	myMap.coordinates = coords
	myMap.buildMap()
}

// window load
function checkLoadTime() {
  const timeout = 5000; // 5 seconds in milliseconds
  let loaded = false;

  setTimeout(function() {
    if (!loaded) {
      alert("The page is taking longer than usual to load.");
    }
  }, timeout);

  window.onload = function() {
    loaded = true;
  };
}

checkLoadTime();


// business submit button
document.getElementById('submit').addEventListener('click', async (event) => {
	event.preventDefault()
	let business = document.getElementById('business').value
	let data = await getFoursquare(business)
	myMap.businesses = processBusinesses(data)
	myMap.addMarkers()
})