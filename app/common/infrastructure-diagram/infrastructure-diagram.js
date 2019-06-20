import React from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import palette from '../palette'

const DEVELOPER_PC_ID = 'dev-pc';
const REGISTRY_ID = 'registry';

class InfrastructureDiagram extends React.Component {
    constructor(props) {
        super(props);
        this.graphRef = React.createRef();
        this.containerRef = React.createRef();
        this.state = {
            width: window.outerWidth,
            height: window.outerHeight,
            registryImages: [],
            localImages: [],
        };
        this.state.graphData = this.generateGraphData();
    }

    generateGraphData(args) {
        args = args || {};
        let nodes = [];
        let links = [];

        for (let i = 0; i < this.props.machines.length; i++) {
            this.props.machines[i].id = i;
        }
        for (let machine of this.props.machines) {
            nodes.push({
                           id: 'machine-' + machine.id,
                           name: machine.name,
                           val: 8,
                           color: '#ccc970'
                       });
            for (let otherMachine of this.props.machines) {
                if (otherMachine !== machine) {
                    links.push({
                                   source: 'machine-' + machine.id,
                                   target: 'machine-' + otherMachine.id,
                                   color: palette.primary.text.dark
                               })
                }
            }
        }

        let registryImages = args.registryImages || this.state.registryImages
                             || [];
        for (let i = 0; i < registryImages.length; i++) {
            let id = 'registry-image-' + i;
            let img = registryImages[i];
            nodes.push({
                           id: id,
                           name: 'Image ' + img + ":latest",
                           val: 2,
                           color: '#5cb9cc'
                       });
            links.push({
                           source: id,
                           target: REGISTRY_ID,
                           color: palette.primary.text.dark
                       });
        }

        let localImages = args.localImages || this.state.localImages || [];
        for (let i = 0; i < localImages.length; i++) {
            let id = 'local-image-' + i;
            let img = localImages[i];
            nodes.push({
                           id: id,
                           name: 'Image ' + img + ":latest",
                           val: 2,
                           color: '#5cb9cc'
                       });
            links.push({
                           source: id,
                           target: DEVELOPER_PC_ID,
                           color: palette.primary.text.dark
                       });
        }

        let deployedImages = args.deployedImages || this.state.deployedImages
                             || [];
        for (let i = 0; i < deployedImages.length; i++) {
            let id = 'pod-' + i;
            let img = deployedImages[i];
            let machineId = 'machine-' + (i % this.props.machines.length);
            nodes.push({
                           id: id,
                           name: 'Pod running "' + img + '"',
                           val: 4,
                           color: '#cc7744'
                       });
            links.push({
                           source: id,
                           target: machineId,
                           color: palette.primary.text.dark
                       })
        }

        nodes[0].position = 'bottom-center';
        return {
            nodes: [
                {
                    id: DEVELOPER_PC_ID,
                    name: "Developer PC",
                    position: 'top-center',
                    val: 8,
                },
                {
                    id: REGISTRY_ID,
                    name: "Registry",
                    position: "center-left",
                    val: 15,
                    color: "#cc7078",
                },
                ...nodes
            ],
            links: [
                ...links
            ]
        }
    }

    setLocalImages(images) {
        this.setState(
            {
                localImages: images,
                graphData: this.generateGraphData({localImages: images})
            });
    }

    setPushedImages(images) {
        this.setState(
            {
                registryImages: images,
                graphData: this.generateGraphData({registryImages: images})
            });
    }

    getPushedImages() {
        return this.state.registryImages;
    }

    setDeployedImages(images) {
        this.setState(
            {
                deployedImages: images,
                graphData: this.generateGraphData({deployedImages: images})
            })
    }

    updateDimensions() {
        this.setState({
                          width: this.containerRef.current.offsetWidth,
                          height: this.containerRef.current.offsetHeight,
                      });
        this.graphRef.current.zoom(2.5);
        this.graphRef.current.centerAt(0, 0);
    }

    forceCenterPositioned() {
        let nodes;
        let diagram = this;

        const getPositions = () => {
            return {
                "top-center": {
                    x: 0,
                    y: -0.12 * diagram.state.height
                },
                "center": {
                    x: 0,
                    y: 0
                },
                "center-left": {
                    x: -0.12 * diagram.state.width,
                    y: 0
                },
                "bottom-center": {
                    x: 0,
                    y: 0.10 * diagram.state.height
                },
            }
        };

        function force(alpha) {
            let positions = getPositions();
            for (let node of nodes) {
                let pos = positions[node.position];
                if (pos) {
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
            for (let node of nodes) {
                if (node.x < -.18 * diagram.state.width) {
                    node.vx += 10 * alpha;
                } else if (node.x > .18 * diagram.state.width) {
                    node.vx -= 10 * alpha;
                }
                if (node.y < -.18 * diagram.state.height) {
                    node.vy += 10 * alpha;
                } else if (node.y > .18 * diagram.state.height) {
                    node.vy -= 10 * alpha;
                }
            }
        }

        force.initialize = function (_) {
            nodes = _;
        };

        return force;
    }

    componentDidMount() {
        this.updateDimensions();

        this.updateDimensionsListener = this.updateDimensions.bind(this);
        window.addEventListener("resize", this.updateDimensionsListener);

        this.graphRef.current.d3Force("center", this.forceCenterPositioned());
        this.graphRef.current.d3Force("wallRepeller", this.forceWallRepeller());
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensionsListener);
    }

    render() {
        const canvas = (
            <ForceGraph2D
                ref={this.graphRef}
                width={this.state.width}
                height={this.state.height}
                graphData={this.state.graphData}
                nodeOpacity={1}
                linkWidth={5}
                enableNavigationControls={false}
                enableZoomPanInteraction={false}
            />
        );

        return (
            <div style={{
                width: '100%',
                height: '25em',
                backgroundColor: palette.primary.background.main,
                content: 'border-box',
                paddingTop: '1em',
                paddingBottom: '10em',
            }}>
                {this.props.title ? (
                    <h2 style={{
                        textAlign: 'center',
                        width: '100%',
                        margin: '0',
                    }}>{this.props.title}</h2>
                ) : null}
                {this.props.subtext ? (
                    <p style={{
                        textAlign: 'center',
                        width: '100%',
                        marginTop: '1em',
                    }}>{this.props.subtext}</p>
                ) : null}
                <div ref={this.containerRef}
                     style={{width: '100%', height: '100%'}}>
                    {canvas}
                </div>
            </div>
        )
    }
}

export default InfrastructureDiagram