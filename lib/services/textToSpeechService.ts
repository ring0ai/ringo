import "server-only";
import sarvamai from "@/config/sarvam";

export const getTextToSpeechService = async (text: string) => {
  const response = await sarvamai.textToSpeech.convert({
    text: "Welcome to Sarvam AI!",
    model: "bulbul:v2",
    speaker: "anushka",
    target_language_code: "en-IN",
  });
  return response.audios;
};
