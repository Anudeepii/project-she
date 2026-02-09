// Step 5: Fetch Danger Zone Data via Chicago Crime API
// No API key required; uses LOCATION_LAT and LOCATION_LON from context
// Chicago Crime API Doc: https://dev.socrata.com/foundry/data.cityofchicago.org/ijzp-q8t2
const fetch = require("node-fetch")

async function getDangerZoneData() {
  const lat = getContext("LOCATION_LAT")
  const lon = getContext("LOCATION_LON")
  if (!lat || !lon) {
    console.error("Missing coordinates from geolocation step (LOCATION_LAT, LOCATION_LON).")
    process.exit(1)
  }
  try {
    // Pull recent crimes within a radius (~0.01 degrees)
    const url = `https://data.cityofchicago.org/resource/ijzp-q8t2.json?$where=within_circle(location,${lat},${lon},500)`
    const response = await fetch(url)
    const data = await response.json()
    setContext("dangerZoneInfo", data)
    console.log("Fetched Chicago danger zone data:", data)
  } catch (e) {
    console.error("Chicago Crime API error:", e)
    process.exit(1)
  }
}
getDangerZoneData()
