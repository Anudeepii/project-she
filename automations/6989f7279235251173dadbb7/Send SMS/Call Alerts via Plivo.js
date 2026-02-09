// Step 3: Send SMS/Call Alerts via selected vendor (MessageBird, Plivo, or Vonage)
// Required environment variables:
//   - SMS_VENDOR (input, 'MessageBird', 'Plivo', 'Nexmo', or 'Vonage')
//   - MESSAGEBIRD_API_KEY (api-credential) [if MessageBird]
//   - MESSAGEBIRD_SENDER_PHONE (input) [if MessageBird]
//   - PLIVO_AUTH_ID (api-credential) [if Plivo]
//   - PLIVO_AUTH_TOKEN (api-credential) [if Plivo]
//   - PLIVO_SENDER_PHONE (input) [if Plivo]
//   - VONAGE_API_KEY (api-credential) [if Nexmo/Vonage]
//   - VONAGE_API_SECRET (api-credential) [if Nexmo/Vonage]
//   - VONAGE_SENDER_PHONE (input) [if Nexmo/Vonage]
//   - ALERT_RECIPIENT_PHONE (input)

// MessageBird API docs: https://developers.messagebird.com/api/sms-messaging/
// Plivo API docs: https://www.plivo.com/docs/sdk/server/node-sdk
// Vonage (Nexmo) SMS REST API docs: https://developer.vonage.com/messaging/sms/send-sms

const axios = require("axios")

async function sendAlertSMS() {
  const smsVendor = process.env.SMS_VENDOR || "Plivo"
  const recipient = process.env.ALERT_RECIPIENT_PHONE
  let smsSent = false
  let result

  if (!recipient) {
    console.error("Missing recipient phone number.")
    process.exit(1)
  }

  const message = "Alert! Dangerous situation detected!"
  const voiceResult = getContext("voiceAnalysis")

  // Retrieve location from context
  let locationLat, locationLon
  try {
    locationLat = getContext("LOCATION_LAT")
    locationLon = getContext("LOCATION_LON")
  } catch (err) {
    console.warn("Location context is missing:", err)
  }

  let smsBody = `${message}\nDetails: ${JSON.stringify(voiceResult)}`
  if (locationLat && locationLon) {
    smsBody += `\nLocation: ${locationLat}, ${locationLon}`
    smsBody += `\nGoogle Maps: https://maps.google.com/?q=${locationLat},${locationLon}`
  } else {
    smsBody += "\nLocation: Not available"
  }

  try {
    if (smsVendor === "MessageBird") {
      const apiKey = process.env.MESSAGEBIRD_API_KEY
      const sender = process.env.MESSAGEBIRD_SENDER_PHONE
      if (!apiKey || !sender) {
        console.error("Missing MessageBird API key or sender phone.")
        process.exit(1)
      }
      const messagebird = require("messagebird").initClient(apiKey)
      const params = {
        originator: sender,
        recipients: [recipient],
        body: smsBody
      }
      await new Promise((resolve, reject) => {
        messagebird.messages.create(params, (err, response) => {
          if (err) {
            console.error("MessageBird API error:", err)
            reject(err)
            process.exit(1)
          } else {
            result = response
            smsSent = true
            console.log("SMS sent via MessageBird:", response)
            resolve()
          }
        })
      })
    } else if (smsVendor === "Plivo") {
      const authId = process.env.PLIVO_AUTH_ID
      const authToken = process.env.PLIVO_AUTH_TOKEN
      const sender = process.env.PLIVO_SENDER_PHONE
      if (!authId || !authToken || !sender) {
        console.error("Missing Plivo credentials or sender phone.")
        process.exit(1)
      }
      const plivo = require("plivo")
      const client = new plivo.Client(authId, authToken)
      result = await client.messages.create(sender, recipient, smsBody)
      smsSent = true
      console.log("SMS sent via Plivo:", result)
    } else if (smsVendor === "Nexmo" || smsVendor === "Vonage") {
      const apiKey = process.env.VONAGE_API_KEY
      const apiSecret = process.env.VONAGE_API_SECRET
      const sender = process.env.VONAGE_SENDER_PHONE
      if (!apiKey || !apiSecret || !sender) {
        console.error("Missing Vonage API key, secret or sender phone.")
        process.exit(1)
      }
      // Vonage SMS REST API
      try {
        const vonageResp = await axios.post(
          "https://rest.nexmo.com/sms/json",
          {
            api_key: apiKey,
            api_secret: apiSecret,
            to: recipient,
            from: sender,
            text: smsBody
          },
          { headers: { "Content-Type": "application/json" } }
        )
        if (vonageResp.data.messages && vonageResp.data.messages[0] && vonageResp.data.messages[0].status === "0") {
          result = vonageResp.data
          smsSent = true
          console.log("SMS sent via Vonage (Nexmo):", vonageResp.data)
        } else {
          console.error("Vonage API error:", vonageResp.data.messages[0] || vonageResp.data)
          process.exit(1)
        }
      } catch (err) {
        console.error("Vonage API error:", err)
        process.exit(1)
      }
    } else {
      console.error("Unsupported SMS vendor. Use 'MessageBird', 'Plivo', 'Nexmo' or 'Vonage'.")
      process.exit(1)
    }
    setContext("smsResult", result)
    if (smsSent) {
      console.log("SMS alert completed successfully.")
    } else {
      console.error("SMS not sent.")
      process.exit(1)
    }
  } catch (e) {
    console.error("API error sending SMS:", e)
    process.exit(1)
  }
}
sendAlertSMS()
