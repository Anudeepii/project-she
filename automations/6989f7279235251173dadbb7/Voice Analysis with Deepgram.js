// Step 2: Voice Analysis with Deepgram
// Required environment variables:
//   - DEEPGRAM_API_KEY (api-credential)
//   - AUDIO_FILE_PATH (file)
// Deepgram API doc: https://developers.deepgram.com/docs/

const fs = require("fs")
const fetch = require("node-fetch")

async function analyzeAudio() {
  const apiKey = process.env.DEEPGRAM_API_KEY
  const audioFilePath = process.env.AUDIO_FILE_PATH
  // Granular error handling for missing env variables
  if (!apiKey || !audioFilePath) {
    if (!apiKey && !audioFilePath) {
      console.error("Missing BOTH DEEPGRAM_API_KEY and AUDIO_FILE_PATH.\n> Please provide your Deepgram API key and specify a valid audio file path in environment variables before running the workflow.")
    } else if (!apiKey) {
      console.error("Missing DEEPGRAM_API_KEY.\n> Please provide your Deepgram API key in environment variables before running the workflow.")
    } else {
      console.error("Missing AUDIO_FILE_PATH.\n> Please provide a valid audio file path in environment variables before running the workflow.")
    }
    process.exit(1)
  }
  const audio = fs.createReadStream(audioFilePath)
  console.log("Uploading audio for analysis...")
  try {
    const response = await fetch("https://api.deepgram.com/v1/listen", {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "audio/wav"
      },
      body: audio
    })
    const result = await response.json()
    setContext("voiceAnalysis", result)
    console.log("Voice analysis complete:", result)
  } catch (e) {
    console.error("Deepgram API error:", e)
    process.exit(1)
  }
}

analyzeAudio()
