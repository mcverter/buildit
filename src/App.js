import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props)

    }

    parse3hrForecast(forecast3day) {
        let forecast = {
            humidity: forecast3day.main.humidity,
            high: forecast3day.main.temp_min,
            low : forecast3day.main.temp_min,
            wind: forecast3day.wind.speed,
            clouds: forecast3day.clouds.all,
            description: forecast3day.weather[0].description,
        };
        forecast.avg_temp = (forecast.high + forecast.low)/2;
        if (forecast3day.snow) {
            forecast.snow = forecast3day.snow["3h"]
        } else if (forecast.rain) {
            forecast.rain = forecast3day.rain["3h"]
        }
        return forecast;
    }

    getMostFrequentDescriptions(descriptions) {
        let count = 1,
            maxcount = 1,
            previous = descriptions[0],
            mostFrequent = descriptions[0];

        descriptions.sort();

        descriptions.forEach((desc)=>{
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

    getDailyAverages(day) {
        let dayslots = day.length,
            averages = {
                humidity: Math.floor((day.reduce((accumulator, slot3hr) => {
                        return accumulator + slot3hr.humidity
                    }, 0)) / dayslots),
                wind: Math.floor((day.reduce((accumulator, slot3hr) => {
                        return accumulator + slot3hr.wind
                    }, 0)) / dayslots),
                clouds: Math.floor((day.reduce((accumulator, slot3hr) => {
                        return accumulator + slot3hr.clouds
                    }, 0)) / dayslots),
                temperature: Math.floor((day.reduce((accumulator, slot3hr) => {
                        return accumulator + slot3hr.avg_temp
                    }, 0)) / dayslots),
                snow: day.reduce((accumulator, slot3hr)=> {
                    return slot3hr.snow ? accumulator + slot3hr.snow : accumulator
                }, 0),
                rain: day.reduce((accumulator, slot3hr)=> {
                    return slot3hr.rain ? accumulator + slot3hr.rain : accumulator
                }, 0),
                low: Math.min.apply(null, (day.map((slot)=>slot.low))),
                high: Math.max.apply(null, (day.map((slot)=>slot.high)))
            };


        averages.description = this.getMostFrequentDescriptions(day.map((slot)=>slot.description));

        day.push(averages);
    }

    parseWeatherIntoFiveDays(json) {
        let list = json.list;

        let today = new Date();
        let fivedayshence = [[],[],[],[],[],[]];
        list.forEach((item) => {
            let day_diference =  new Date(item.dt * 1000).getDay() - today.getDay();
            if (day_diference < 0) {
                day_diference += 7;
            }
            fivedayshence[day_diference].push(this.parse3hrForecast(item));
        });

        if (fivedayshence[0].length < 1) {
            fivedayshence.unshift()
        } else {
            fivedayshence.pop()
        }

        fivedayshence.forEach((day)=>{
            this.getDailyAverages(day);
        })
    }

    componentWillMount() {
        var that = this;
        fetch('http://api.openweathermap.org/data/2.5/forecast?q=London,uk&appid=5600ae5de1c6466f48af19790a6e2e7f').then(function(response) {
            var contentType = response.headers.get("content-type");
            if(contentType && contentType.indexOf("application/json") !== -1) {
                return response.json().then(function(json) {

                    that.parseWeatherIntoFiveDays(json);
                });
            } else {
                console.log("Oops, we haven't got JSON!");
            }
        });
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to React</h2>
                </div>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
            </div>
        );
    }
}

export default App;