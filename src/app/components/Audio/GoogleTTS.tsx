import * as googleTTS from 'google-tts-api'; // ES6 or TypeScript
import { memo, useEffect, useState } from "react";
import ReactAudioPlayer from 'react-audio-player';

type GoogleTTSProps = {
    id: string,
    text: string,
    className?: string
}

const GoogleTTS = (props:GoogleTTSProps) => {
    const { id, text, className } = props;
    const [url, setUrl] = useState<string>();
    // '如何なる'
    

    const handleGetSpeech = () => {
        // if(audio) {
        //     audio.play();
        // }
        // document.getElementById('song').play()
        // document.getElementById('song').pause()
        // document.getElementById('song').volume += 0.1
        // document.getElementById('song').volume -= 0.1
    }

    const handleClickPlay = (id: string) => {
        // document?.getElementById(id).play();
    }

    useEffect(() => {
        const resultUrl = googleTTS.getAudioUrl(text, {
            lang: 'ja',
            slow: false,
            host: 'https://translate.google.com',
        });

        setUrl(resultUrl);
    }, [text])

    return (
        <>
            <ReactAudioPlayer
                id={id}
                src={url}
                autoPlay
                controls
                />
           
        </>
    );
}

export default memo(GoogleTTS)