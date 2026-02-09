// Step 1: Research APIs & set context
// This step documents the APIs selected for each function, including vendor comparison and credential requirements.

// Selected APIs:
// - Voice Analysis: Deepgram (https://developers.deepgram.com/docs/) [Free up to 200 hours/month; API key required]
// - SMS/Call Alerts: MessageBird (https://developers.messagebird.com/api/sms-messaging/) [Free trial credits; API key required] OR Plivo (https://www.plivo.com/docs/sdk/server/node-sdk) [Free trial credits; Auth ID & Auth Token required]
// - Geolocation/Maps: LocationIQ (https://locationiq.com/docs) [Free API key; up to 10k requests/day]
// - Danger Zone: Chicago Crime Data (https://dev.socrata.com/foundry/data.cityofchicago.org/ijzp-q8t2) [Open/public, US-specific]

// --- Vendor Comparison ---
// | Vendor      | API Docs                                 | Credentials         | Features/Notes          |
// |-------------|------------------------------------------|---------------------|-------------------------|
// | MessageBird | https://developers.messagebird.com/api   | API key, sender     | Official SDK, wide intl |
// | Plivo       | https://www.plivo.com/docs/sdk/server/node-sdk | Auth ID & Token, sender | Official SDK, robust voice/calls |
// Both offer Node.js SDKs, robust error/status, free credits, E.164 sender/recipient support.
// Use SMS_VENDOR env or context to choose vendor dynamically.

setContext("selectedAPIs", {
  voiceAnalysis: {
    name: "Deepgram",
    docs: "https://developers.deepgram.com/docs/",
    notes: "Free up to 200 hours/month",
    keyRequired: true
  },
  smsCallAlert: {
    name: "MessageBird or Plivo",
    docs: "https://developers.messagebird.com/api; https://www.plivo.com/docs/sdk/server/node-sdk",
    notes: "Free trial credits, choose vendor via SMS_VENDOR env/context",
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

console.log("API selections recorded in context, including vendor comparison for SMS alerts.")
