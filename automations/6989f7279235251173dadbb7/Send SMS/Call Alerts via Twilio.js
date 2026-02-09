// Step 3: Send SMS/Call Alerts via Twilio
// Required environment variables:
//   - TWILIO_ACCOUNT_SID (api-credential)
//   - TWILIO_AUTH_TOKEN (api-credential)
//   - ALERT_RECIPIENT_PHONE (input)
//   - TWILIO_SENDER_PHONE (input)

// Twilio API doc: https://www.twilio.com/docs/sms/send-messages
// GitHub example: https://github.com/twilio/twilio-node
const twilio = require("twilio")

async function sendAlertSMS() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const recipient = process.env.ALERT_RECIPIENT_PHONE
  const sender = process.env.TWILIO_SENDER_PHONE
  if (!accountSid || !authToken || !recipient || !sender) {
    console.error("Missing Twilio SMS credentials or phone numbers.")
    process.exit(1)
  }
  const client = twilio(accountSid, authToken)
  const message = "Alert! Dangerous situation detected!"
  const voiceResult = getContext("voiceAnalysis")

  // Atomic: Retrieve location from context
  let locationLat, locationLon
  try {
    locationLat = getContext("LOCATION_LAT")
    locationLon = getContext("LOCATION_LON")
  } catch (err) {
    console.warn("Location context is missing:", err)
  }

  // Atomic: Update SMS body with location info
  let smsBody = `${message}\nDetails: ${JSON.stringify(voiceResult)}`
  if (locationLat && locationLon) {
    smsBody += `\nLocation: ${locationLat}, ${locationLon}`
    smsBody += `\nGoogle Maps: https://maps.google.com/?q=${locationLat},${locationLon}`
  } else {
    smsBody += "\nLocation: Not available"
  }

  try {
    const sms = await client.messages.create({
      body: smsBody,
      from: sender,
      to: recipient
    })
    setContext("smsResult", sms)
    console.log("SMS sent via Twilio:", sms)
  } catch (e) {
    console.error("Twilio API error:", e)
    process.exit(1)
  }
}
sendAlertSMS()
