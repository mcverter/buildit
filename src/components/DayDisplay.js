import React from 'react';
import moment from 'moment';
import TempDisplay from './TempDisplay'

const DayDisplay = ({datetime, weather_id, humidity, clouds, temperature, snow, rain, low, high, description}) => {
    const getDay = (timestamp) => {
        return moment(timestamp).format('dddd');
    };

    const getDate = (timestamp) => {
        return moment(timestamp).format('MMMM Do, YYYY');
    };

    const iconClass = `weather-icon owf owf-${weather_id}-d owf-5x`;
    return (
        <div className="day-display">
            <div className="day-heading">
                <p> {getDay(datetime)}</p>
                <p> {getDate(datetime)}</p>
            </div>
            <div className="day-content">
                <div className="day-weather-main">
                    <i className={iconClass} />
                    <h2>{description}</h2>
                </div>
                <div className="day-temperature">
                    <h3>Temperature </h3>
                    <p>Average: {TempDisplay(temperature)}</p>
                    <p>High: {TempDisplay(high)} </p>
                    <p>Low: {TempDisplay(low)} </p>
                </div>
                <div className="day-phenomena">
                    <h3>Conditions </h3>
                    <p>Cloudiness: {clouds}%</p>
                    <p>Humidity: {humidity}%</p>
                    {rain > 0 && <p>Rain: {rain}</p>}
                    {snow > 0 && <p>Snow: {snow}</p>}
                </div>
            </div>
        </div>
    )
};

export default DayDisplay;