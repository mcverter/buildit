import React from 'react';

export const farFromKelvin = (kval) => {
    return Math.round((kval * 1.8) - 459.67);
};

const celsiusFromKelvin = (kval) => {
    return Math.round(kval - 273.15);
};

const TempDisplay = (kelvin) => (
    <span>
        {farFromKelvin(kelvin)}°F / {celsiusFromKelvin(kelvin)}°C
    </span>
);

export default TempDisplay;
