// Step 1: Research APIs & set context
// This step documents the APIs selected for each function, including vendor and credential requirements.

// Selected APIs:
// - Voice Analysis: Deepgram (https://developers.deepgram.com/docs/) [Free up to 200 hours/month; API key required]
// - SMS/Call Alerts: Nexmo/Vonage (https://developer.vonage.com/messaging/sms/send-sms) [Free trial credits; API key & secret required]
// - Geolocation/Maps: LocationIQ (https://locationiq.com/docs) [Free API key; up to 10k requests/day]
// - Danger Zone: Chicago Crime Data (https://dev.socrata.com/foundry/data.cityofchicago.org/ijzp-q8t2) [Open/public, US-specific]

// --- Vendor Details ---
// | Vendor   | API Docs                                   | Credentials            | Features/Notes            |
// |----------|--------------------------------------------|------------------------|---------------------------|
// | Vonage   | https://developer.vonage.com/messaging/sms/send-sms | API key, secret, sender | SMS/call, robust REST API |
// (Vonage is formerly Nexmo, now unified APIs.)
//
setContext("selectedAPIs", {
  voiceAnalysis: {
    name: "Deepgram",
    docs: "https://developers.deepgram.com/docs/",
    notes: "Free up to 200 hours/month",
    keyRequired: true
  },
  smsCallAlert: {
    name: "Nexmo/Vonage",
    docs: "https://developer.vonage.com/messaging/sms/send-sms",
    notes: "Free trial credits, API key/secret required",
    keyRequired: true
  },
  geolocationMap: {
    name: "LocationIQ",
    docs: "https://locationiq.com/docs",
    notes: "Free API key",
    keyRequired: true
  },
  dangerZone: {
    name: "ChicagoCrimeData",
    docs: "https://dev.socrata.com/foundry/data.cityofchicago.org/ijzp-q8t2",
    notes: "Open/public, no key required",
    keyRequired: false
  }
})

console.log("API selections recorded in context. SMS/call alerts now use Nexmo/Vonage only.")
