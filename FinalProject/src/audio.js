
/**
 * File Name: audio.js
 * Author: Finian Lugtigheid & Kenneth Renald Hoesien
 * Date: April 12th, 2025
 * Description:
 *  This file handles sound loading and playback using the Web Audio API.
 * It adds sound effects for actions like unlocking land, planting, and harvesting crops.
 */

const audioContext = new AudioContext();

export async function loadSound(url, volume=1.0, loop = false) {
    const audio = await fetch(url).then(r => r.arrayBuffer()).then(ab => audioContext.decodeAudioData(ab));
    audio.play = () => {
        const source = audioContext.createBufferSource();
        source.buffer = audio;
        source.loop = loop;

        const gainNode = audioContext.createGain();
        gainNode.gain.value = volume;

        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        source.start();
    }
    return audio;
}