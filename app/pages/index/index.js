import React from 'react';
import ReactDOM from 'react-dom';
import Carousel from '../../common/carousel';
import ForceGraph2D from 'react-force-graph-2d';
import IndexTerminal from './index_terminal'

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

class EnvironmentForceGraph extends React.Component {
    constructor(props) {
        super(props);
        this.forceGraph = React.createRef();
    }

    componentDidMount() {
        this.forceGraph.current.zoom(1)
    }

    render() {
        return (
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <ForceGraph2D
                    ref={this.forceGraph}
                    linkDirectionalParticles={2}
                    graphData={{
                        nodes: Array(this.props.machines).fill(null).map((_, idx) => ({id: idx})),
                        links: []
                    }}
                    width={150}
                    height={150}
                />
                <span style={{marginTop: 'auto', marginBottom: 'auto'}}>
                {this.props.name}
                </span>
            </div>
        )
    }
}

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
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{display: 'flex', flexDirection: 'column', width: '75%'}}>
                <Carousel variant="contained" color="primary" panels={[
                    <h2 style={{textAlign: 'center'}}>A rich environment
                        system</h2>,
                    <h2 style={{textAlign: 'center'}}>A rich environment
                        system</h2>,
                    <h2 style={{textAlign: 'center'}}>A rich environment
                        system</h2>,
                ]}/>
                <IndexTerminal />
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '25%'
            }}>
                {environments.map(createEnvForceGraph)}
            </div>
        </div>
    );
}

ReactDOM.render(
    <SanicFeatures/>,
    document.querySelector('#sanic-features-interactive')
);