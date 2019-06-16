import React from 'react';
import ReactDOM from 'react-dom';
import IndexTerminal from './index-terminal';
import {InfrastructureDiagram} from '../../common/infrastructure-diagram';
import SwipableCarousel from '../../common/carousel';

const environments = [
    {
        'name': 'dev',
        'machines': 3
    },
    {
        'name': 'staging',
        'machines': 1
    },
    {
        'name': 'prod',
        'machines': 5
    }
];

function createEnvForceGraph(env) {
    return (
        <EnvironmentForceGraph
            name={env.name}
            key={env.name}
            machines={env.machines}
            style={{marginTop: 'auto', marginBottom: 'auto'}}
        />
    )
}

function SanicFeatures() {
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <IndexTerminal/>
            <SwipableCarousel>
                <InfrastructureDiagram title='dev'/>
                <InfrastructureDiagram title='staging'/>
                <InfrastructureDiagram title='prod'/>
            </SwipableCarousel>
        </div>
    );
}

ReactDOM.render(
    <SanicFeatures/>,
    document.querySelector('#sanic-features-interactive')
);