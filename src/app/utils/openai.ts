"use server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});

const playSpeech = async(text: string) => {
    if (!openai.apiKey) {
        throw new Error("Missing API Key");
    }

    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: text,
    })

    const blob = new Blob([await mp3.arrayBuffer()], { type: "audio/mpeg" });
    const objectUrl = URL.createObjectURL(blob);

    // Testing for now
    const audio = new Audio(objectUrl);
    audio.play();
}

export {
    playSpeech
}