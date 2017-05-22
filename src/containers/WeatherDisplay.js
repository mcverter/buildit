import React, {Component} from 'react';
import FiveDayDisplay from '../components/FiveDayDisplay';
import {WEATHER_API_KEY} from '../config'
import Chart from '../components/Chart';
import {farFromKelvin} from '../components/TempDisplay';

class WeatherDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slots: undefined
        };
    };

    componentWillMount() {
        const that = this;
        fetch('http://api.openweathermap.org/data/2.5/forecast?q=New%20York,us&appid=' + WEATHER_API_KEY).then((response) => {
            const contentType = response.headers.get("content-type");
            if(contentType && contentType.indexOf("application/json") !== -1) {
                return response.json().then((json) => {
                    that.parseWeatherIntoFiveDays(json);
                });
            } else {
                console.log("Oops, we haven't got JSON!");
            }
        });
    }

    parse3hrForecast(forecast3day) {
        let forecast = {
            datetime: forecast3day.dt * 1000,
            humidity: forecast3day.main.humidity,
            high: forecast3day.main.temp_max,
            low : forecast3day.main.temp_min,
            wind: forecast3day.wind.speed,
            clouds: forecast3day.clouds.all,
            description: forecast3day.weather[0].description,
            main: forecast3day.weather[0].main,
            weather_id: forecast3day.weather[0].id
        };

        forecast.avg_temp = (forecast.high + forecast.low)/2;
        if (forecast3day.snow) {
            forecast.snow = forecast3day.snow["3h"]
        } else if (forecast.rain) {
            forecast.rain = forecast3day.rain["3h"]
        }
        return forecast;
    }

    getMostFrequent(descriptions) {
        descriptions.sort();

        let count = 1,
            maxcount = 1,
            previous = descriptions[0],
            mostFrequent = descriptions[0];

        descriptions.slice(1).forEach((desc)=>{
            if (desc === previous) {
                count += 1
            } else {
                if (count > maxcount) {
                    maxcount = count;
                    mostFrequent = previous;
                }
                count = 1;
            }
            previous = desc;
        });

        if (count > maxcount) {
            return descriptions[descriptions.length-1];
        }
        else {
            return mostFrequent;
        }
    }

    getDailyValues(slots) {
        const numSlots = slots.length;
        let daily = {
                datetime: slots[0].datetime,
                temperature: Math.floor(slots.reduce((accumulator, slot) => {
                        return accumulator + slot.avg_temp
                    }, 0) / numSlots),
                humidity: Math.floor(slots.reduce((accumulator, slot) => {
                        return accumulator + slot.humidity
                    }, 0) / numSlots),
                wind: Math.floor((slots.reduce((accumulator, slot) => {
                        return accumulator + slot.wind
                    }, 0)) / numSlots),
                clouds: Math.floor((slots.reduce((accumulator, slot) => {
                        return accumulator + slot.clouds
                    }, 0)) / numSlots),
                snow: slots.reduce((accumulator, slot)=> {
                    return slot.snow ? accumulator + slot.snow : accumulator
                }, 0),
                rain: slots.reduce((accumulator, slot)=> {
                    return slot.rain ? accumulator + slot.rain : accumulator
                }, 0),
                low: Math.min.apply(null, (slots.map((slot)=>slot.low))),
                high: Math.max.apply(null, (slots.map((slot)=>slot.high)))
            };

        daily.description = this.getMostFrequent(slots.map((slot)=>slot.description));
        daily.weather_id = this.getMostFrequent(slots.map((slot)=>slot.weather_id));
        return daily;
    }

    parseWeatherIntoFiveDays(json) {
        let list = json.list;

        let today = new Date();
        let fivedayshence = [[],[],[],[],[],[]];
        list.forEach((item) => {
            let day_diference =  new Date(item.dt*1000).getDay() - today.getDay();
            if (day_diference < 0) {
                day_diference += 7;
            }
            fivedayshence[day_diference].push(this.parse3hrForecast(item));
        });

        /* Depending on the time we query, we either have five slots for each day, */
        if (fivedayshence[0].length < 1) {
            fivedayshence.unshift()
        } else {
            fivedayshence.pop()
        }
        this.setState({
            slots: fivedayshence,
        });
    }

    render() {
        const {slots} = this.state;
        if (! slots || slots.length < 1) {
            return (<div>Loading ...</div>)
        }

        const days = slots.map((day)=>{
            return this.getDailyValues(day);
        });

        const humidity = slots.reduce(( accumulator, daily)=> {
            return accumulator.concat(daily.map(slot=>{
                return {datetime: slot.datetime,
                    value: slot.humidity} }));}, []);

        const temperature =  slots.reduce(( accumulator, daily)=>{
            return accumulator.concat(daily.map(slot=>{
                return {datetime: slot.datetime,
                    value: farFromKelvin(slot.avg_temp)}}));}, []);

        return (
            <div>
                <div className="page-header">
                    Five Day Weather Forecast in New York
                </div>
                <FiveDayDisplay  days={days}/>
                <Chart title="Temperature (Farenheit)" data={temperature}/>
                <Chart title="Percent Humidity" data={ humidity }/>
            </div>
        );
    }
}

export default WeatherDisplay;