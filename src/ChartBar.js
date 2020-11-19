import React from 'react';
import globals from './globals.js';
import { HorizontalBar } from 'react-chartjs-2';
// import { Line, Pie, Doughnut, Bar, Radar, Polar, Bubble, Scatter } from 'react-chartjs-2';
export default class ChartBar extends React.Component {
    constructor(props) {
        super(props);
        this.chart_ref = React.createRef();
    }

    render() {
        // console.log("props",this.props);
        // console.log("Transformed",transformArrayOfArrays(this.props.data, "item", "count"));
        if(this.props.data){

            let _labels = this.props.data.labelArray;
            let _data = this.props.data.valueArray;
            if(this.props.data.labelArrayFinal) {
                _labels = this.props.data.labelArrayFinal;
                _data = this.props.data.valueArrayFinal;
            } else if(this.props.data.labelArrayDraft) {
                _labels = this.props.data.labelArrayDraft;
                _data = this.props.data.valueArrayDraft;
            }

            const options = { 
                labels: {
                    fontSize: 20
                }
            };

            const data = {
                labels: _labels,
                datasets: [
                    {
                        label: this.props.label,
                        data: _data,
                        // backgroundColor: [
                        // "Red",
                        // "Blue",
                        // "Yellow",
                        // "Green",
                        // "Purple",
                        // "Orange"
                        // ],
                        backgroundColor: globals.colors
                        // borderColor: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                        // borderWidth: 1
                    }
                ]
            };
    
            return (
                <div className="chart-holder bar-holder">
                    <h2>{this.props.label}</h2>
                    <HorizontalBar ref={this.chart_ref} data={data} options={options} />
                </div>
            );
        }

        return <></>;
        
    }

    componentDidMount() {
        // if(this.chart_ref.chart){
            // console.log("props",this.props.data);
            // const { datasets } = this.chart_ref.chart.chartInstance.data
            // console.log("Dataset 0",datasets[0].data);
        // }
    }
}
