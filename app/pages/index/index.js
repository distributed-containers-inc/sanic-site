import React from 'react';
import ReactDOM from 'react-dom';
import Carousel from '../../common/carousel';
import palette from '../../common/palette';
import ReactTerminal from 'react-terminal-component';
import ForceGraph2D from 'react-force-graph-2d';

class ForceGraphEnvironment extends React.Component {
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
                        nodes: [{id: 1}, {id: 2}],
                        links: [{source: 1, target: 2}]
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
                <ReactTerminal
                    autoFocus={false}
                    clickToFocus={true}
                    theme={{
                        background: palette.primary.background.dark,
                        promptSymbolColor: palette.primary.text.main,
                        commandColor: palette.primary.text.main,
                        outputColor: palette.primary.text.main,
                        errorOutputColor: palette.primary.error.main,
                        fontSize: '1.1rem',
                        spacing: '1%',
                        fontFamily: 'monospace',
                        width: '98%',
                        height: '6em',
                    }}
                />
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '25%'
            }}>
                <ForceGraphEnvironment name='dev' style={{marginTop: 'auto', marginBottom: 'auto'}}/>
                <ForceGraphEnvironment name='staging' style={{marginTop: 'auto', marginBottom: 'auto'}}/>
                <ForceGraphEnvironment name='prod' style={{marginTop: 'auto', marginBottom: 'auto'}}/>
            </div>
        </div>
    );
}

ReactDOM.render(
    <SanicFeatures/>,
    document.querySelector('#sanic-features-interactive')
);