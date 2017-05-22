import React, { Component } from 'react';
import './css/App.css';
import './css/owfont.min.css';
import WeatherDisplay from './containers/WeatherDisplay';

class App extends Component {

    render() {
        return (
            <WeatherDisplay/>
        );
    }
}

export default App;