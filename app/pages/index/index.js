import React from 'react';
import ReactDOM from 'react-dom';
import IndexTerminal from './index-terminal';
import {InfrastructureDiagram} from '../../common/infrastructure-diagram';
import SwipableCarousel from '../../common/carousel';

const environments = [
    {
        'name': 'dev',
        'machines': [
            {
                "name": "Kubelet-in-Docker #1",
            },
            {
                "name": "Kubelet-in-Docker #2"
            },
            {
                "name": "Kubelet-in-Docker #3"
            }
        ]
    },
    {
        'name': 'staging',
        'machines': [
            {
                "name": "Staging server"
            }
        ]
    },
    {
        'name': 'prod',
        'machines': [
            {
                "name": "Production server #1",
                "containers": [
                    {
                        "name": "Ingress controller"
                    }
                ]
            },
            {
                "name": "Production server #2"
            },
            {
                "name": "Production server #3"
            },
            {
                "name": "Production server #4"
            },
            {
                "name": "Production server #5"
            },
        ],
    },
];

class SanicFeatures extends React.Component {
    constructor(props) {
        super(props);

        this.terminalRef = React.createRef();
        this.carouselRef = React.createRef();
        this.diagramRef = React.createRef();
    }

    componentDidMount() {

    }

    render() {
        return (
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <IndexTerminal ref={this.terminalRef}/>
                <SwipableCarousel ref={this.carouselRef}>
                    {environments.map(env => (
                        <InfrastructureDiagram
                            title={"Environment: " + env.name}
                            machines={env.machines}
                            key={env.name}
                            ref={this.diagramRef}
                        />
                    ))}
                </SwipableCarousel>
            </div>
        );
    }
}

ReactDOM.render(
    <SanicFeatures/>,
    document.querySelector('#sanic-features-interactive')
);