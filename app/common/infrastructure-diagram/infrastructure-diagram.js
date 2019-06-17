import React from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import palette from '../palette'

class InfrastructureDiagram extends React.Component {
    constructor(props) {
        super(props);
        this.graphRef = React.createRef();
        this.containerRef = React.createRef();
    }

    generateGraphData() {
        return {
            nodes: [
                {id: 1, name: "Developer PC", position: 'top-top-center', val: 2},
                {id: 2, name: "node 2", val: 5},
                {id: 3, name: "node 3", val: 5},
                {id: 4, name: "Registry", position: "center-left", val: 15}],
            links: [
                {source: 1, target: 2},
                {source: 3, target: 2}]
        }
    }

    updateDimensions() {
        this.setState({
                          width: this.containerRef.current.offsetWidth,
                          height: this.containerRef.current.offsetHeight,
                      })
    }

    forceCenterPositioned() {
        let nodes;
        let diagram = this;

        const getPositions = () => {
            return {
                "top-top-center": {
                    x: 0,
                    y: -0.175*diagram.state.height
                },
                "center": {
                    x: 0,
                    y: 0
                },
                "center-left": {
                    x: -0.15*diagram.state.width,
                    y: 0
                },
            }
        };

        function force(alpha) {
            let positions = getPositions();
            for (let node of nodes) {
                let pos = positions[node.position];
                if(pos) {
                    node.vx += (pos.x - node.x) * alpha;
                    node.vy += (pos.y - node.y) * alpha;
                }
            }
        }

        force.initialize = function (_) {
            nodes = _;
        };

        return force;
    }

    forceWallRepeller() {
        let nodes;
        let diagram = this;

        function force(alpha) {
            for(let node of nodes) {
                if(node.x < -.18*diagram.state.width) {
                    node.x += 10 * alpha;
                } else if(node.x > .18*diagram.state.width) {
                    node.x -= 10 * alpha;
                }
                if(node.y < -.18*diagram.state.height) {
                    node.y += 10 * alpha;
                } else if(node.y > .18*diagram.state.height) {
                    node.y -= 10 * alpha;
                }
            }
        }

        force.initialize = function(_) {
            nodes = _;
        };

        return force;
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", () => {this.updateDimensions()});
        this.graphRef.current.d3Force("center", this.forceCenterPositioned());
        this.graphRef.current.d3Force("wallRepeller", this.forceWallRepeller());
    }

    componentWillUnmount() {
        window.removeEventListener("resize", () => {this.updateDimensions()});
    }

    render() {
        const canvas = (
            <ForceGraph2D
                ref={this.graphRef}
                width={this.state && this.state.width || window.outerWidth}
                height={this.state && this.state.height || window.outerHeight}
                graphData={this.generateGraphData()}
                linkWidth={5}
                enableNavigationControls={false}
                enableZoomPanInteraction={false}
            />
        );

        return (
            <div style={{
                     width: '100%',
                     height: '30em',
                     backgroundColor: palette.primary.background.main,
                     content: 'border-box',
                     paddingTop: '1em',
                     paddingBottom: '4.5em',
                 }}>
                {this.props.title ? (
                    <h2 style={{
                        textAlign: 'center',
                        width: '100%',
                        margin: '0'
                    }}>{this.props.title}</h2>
                ) : null}
                <div ref={this.containerRef} style={{width: '100%', height: '100%'}}>
                {canvas}
                </div>
            </div>
        )
    }
}

export default InfrastructureDiagram