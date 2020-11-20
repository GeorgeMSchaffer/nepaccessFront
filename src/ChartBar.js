import React from 'react';
import globals from './globals.js';
import { Bar, HorizontalBar } from 'react-chartjs-2';
// import { Line, Pie, Doughnut, Bar, Radar, Polar, Bubble, Scatter } from 'react-chartjs-2';
export default class ChartBar extends React.Component {
    constructor(props) {
        super(props);
        this.chart_ref = React.createRef();
    }

    render() {
        if(this.props.data && this.props.data[0] && this.props.data[1]){ // "Grouped" bar with draft and final

            let _labelsDraft = this.props.data[0].labelArrayDraft;
            // let _labelsFinal = this.props.data[1].labelArrayFinal; // labels should be the same and in the same order
            let _dataDraft = this.props.data[0].valueArrayDraft;
            let _dataFinal = this.props.data[1].valueArrayFinal;

            const data = {
                labels: _labelsDraft,
                datasets: [
                    {
                        label: "Draft",
                        backgroundColor: "#E66100",
                        data: _dataDraft,
                    }, {
                        label: "Final",
                        backgroundColor: "#5D3A9B",
                        data: _dataFinal
                    }
                ]
            };
            const options = {
                title: {
                    display: false,
                    text: this.props.label
                }
            };
    
            return (
                <div className="chart-holder bar-holder">
                    <h2>{this.props.label}</h2>
                    <Bar ref={this.chart_ref} data={data} options={options} />
                </div>
            );

        }
        else if(this.props.data) {

            let _labels = this.props.data.labelArray;
            let _data = this.props.data.valueArray;
            if(this.props.data.labelArrayFinal) {
                _labels = this.props.data.labelArrayFinal;
                _data = this.props.data.valueArrayFinal;
            } else if(this.props.data.labelArrayDraft) {
                _labels = this.props.data.labelArrayDraft;
                _data = this.props.data.valueArrayDraft;
            }

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
            const options = {
                legend: {
                    labels: {
                        fontSize: 0
                    }
                }
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
