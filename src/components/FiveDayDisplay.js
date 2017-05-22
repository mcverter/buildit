import React from 'react'
import Day from './DayDisplay';

const FiveDayDisplay = ({days}) => {
    return (
        <div className="five-day-display">
            {days.map((full => (
                <Day
                    key={full.datetime}
                    datetime={full.datetime}
                    humidity={full.humidity}
                    wind={full.wind}
                    clouds={full.clouds}
                    temperature={full.temperature}
                    snow={full.snow}
                    rain={full.rain}
                    low={full.low}
                    high={full.high}
                    description={full.description}
                    weather_id={full.weather_id}
                />
            )))}
        </div>
    )
};

export default FiveDayDisplay;
