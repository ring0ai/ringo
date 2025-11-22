import fs from "fs";
import path from "path";

const deepgramDefaultConfig = {
  type: "Settings",
  audio: {
    input: {
      encoding: "mulaw",
      sample_rate: 8000,
    },
    output: {
      encoding: "mulaw",
      sample_rate: 8000,
      container: "none",
    },
  },
  agent: {
    language: "en",
    speak: {
      provider: {
        type: "deepgram",
        model: "aura-2-thalia-en",
      },
    },
    listen: {
      provider: {
        type: "deepgram",
        model: "nova-3",
      },
    },
    think: {
      provider: {
        type: "open_ai",
        model: "gpt-4o-mini",
        temperature: 0.7,
      },
      prompt: fs.readFileSync(
        path.join(process.cwd(), "config/deepgramPrompt.txt"),
        'utf-8'
      ).replace(/\n/g, "\\n")
    },
  },
};

export default deepgramDefaultConfig;
