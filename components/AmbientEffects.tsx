
import React from 'react';
import { Mood, TimeOfDay } from '../types';

interface AmbientEffectsProps {
    mood: Mood;
    timeOfDay: TimeOfDay;
}

const AmbientEffects: React.FC<AmbientEffectsProps> = ({ mood, timeOfDay }) => {
    
    let effectClass = '';
    
    if (mood === 'mysterious' || mood === 'dark') {
        effectClass = 'fog';
    } else if (mood === 'tense' && Math.random() > 0.5) { // 50% chance of rain in tense scenes
        effectClass = 'rain';
    } else if (timeOfDay === 'Night' && mood !== 'tense') {
        effectClass = 'stars';
    }

    if (!effectClass) return null;

    return (
        <>
            <style>
                {`
                @keyframes move-fog {
                    0% { transform: translateX(-10%); }
                    100% { transform: translateX(10%); }
                }
                .fog::before, .fog::after {
                    content: '';
                    position: absolute;
                    top: 0; left: -50%; right: -50%; bottom: 0;
                    background-image: url('https://www.transparenttextures.com/patterns/fog.png');
                    opacity: 0.1;
                    animation: move-fog 60s linear infinite alternate;
                    z-index: 0;
                }
                .fog::after {
                    animation-duration: 45s;
                    animation-direction: alternate-reverse;
                    opacity: 0.08;
                }
                @keyframes fall {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                .rain-drop {
                    position: absolute;
                    width: 1px;
                    height: 50px;
                    background: linear-gradient(transparent, rgba(173, 216, 230, 0.5));
                    animation: fall 1s linear infinite;
                }
                @keyframes twinkle {
                    0%, 100% { opacity: 0; }
                    50% { opacity: 1; }
                }
                .star {
                    position: absolute;
                    width: 2px;
                    height: 2px;
                    background-color: white;
                    border-radius: 50%;
                    animation: twinkle 4s ease-in-out infinite;
                }
                `}
            </style>
            <div className={`absolute inset-0 overflow-hidden z-0 pointer-events-none ${effectClass}`}>
                {effectClass === 'rain' && Array.from({ length: 50 }).map((_, i) => (
                    <div
                        key={i}
                        className="rain-drop"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${0.5 + Math.random() * 0.5}s`
                        }}
                    />
                ))}
                 {effectClass === 'stars' && Array.from({ length: 100 }).map((_, i) => (
                    <div
                        key={i}
                        className="star"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 4}s`,
                        }}
                    />
                ))}
            </div>
        </>
    );
};

export default AmbientEffects;
