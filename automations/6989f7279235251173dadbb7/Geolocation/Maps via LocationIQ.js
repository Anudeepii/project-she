// Step 4: Geolocation/Maps via LocationIQ
// Required environment variables:
//   - LOCATIONIQ_API_KEY (api-credential)
//   - USER_LOCATION (input, optional address)

// LocationIQ doc: https://locationiq.com/docs
const fetch = require("node-fetch")

async function getCoordinates() {
  const apiKey = process.env.LOCATIONIQ_API_KEY
  const userLocation = process.env.USER_LOCATION || "Chicago, IL" // Default for demo
  if (!apiKey || !userLocation) {
    console.error("Missing LocationIQ API key or user location.")
    process.exit(1)
  }
  try {
    const response = await fetch(`https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${encodeURIComponent(userLocation)}&format=json`)
    const data = await response.json()
    if (!data || !data[0]) {
      console.error("LocationIQ response invalid:", data)
      process.exit(1)
    }
    const lat = data[0].lat
    const lon = data[0].lon
    setContext("LOCATION_LAT", lat)
    setContext("LOCATION_LON", lon)
    setContext("locationIQResult", data)
    console.log("Fetched geolocation:", { lat, lon })
  } catch (e) {
    console.error("LocationIQ error:", e)
    process.exit(1)
  }
}
getCoordinates()
