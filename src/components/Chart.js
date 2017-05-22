import {VictoryChart,VictoryAxis, VictoryLine, VictoryTooltip,
    VictoryScatter, VictoryTheme} from 'victory';
import React from 'react';
import moment from 'moment';

const Chart = ({data, title}) => {
    return (
        <div className="chart">
            <h1 style={{textAlign: "center"}}>{title}</h1>
            <VictoryChart  theme={VictoryTheme.material} width={450} height={300}>
                <VictoryAxis scale="time"/>
                <VictoryAxis dependentAxis tickValues={[0,10,20,30,40,50,60,70,80, 90,100]}/>

                <VictoryScatter data={data}
                                width={450} height={300}
                                labels={(d) => {
                                    return moment(d.x).format('dddd hA')
                                        + ': ' + d.y}}
                                labelComponent={<VictoryTooltip/>}
                                x="datetime"
                                y="value"
                />
                <VictoryLine data={data}
                             width={450} height={300}
                             x="datetime"
                             y="value"
                />
            </VictoryChart>
        </div>
    )
};
export default Chart