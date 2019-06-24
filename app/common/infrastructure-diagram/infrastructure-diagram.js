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
            graphData: {
                nodes: [],
                links: [],
            }
        };
    }

    setupInitialGraph() {
        this.setState(() => {
            const newNodes = [];
            const newLinks = [];
            for (let machine of this.props.machines) {
                newNodes.push({
                                  id: 'machine-' + machine.name,
                                  machineId: machine.name,
                                  name: machine.name,
                                  val: 4,
                                  color: 'rgba(204, 201, 112, 0.7)'
                              });
            }
            newNodes[0].position = 'bottom-center';

            for (let nodeA of newNodes) {
                for (let nodeB of newNodes) {
                    if (nodeA !== nodeB) {
                        newLinks.push({
                                          source: nodeA.id,
                                          target: nodeB.id,
                                          color: palette.primary.text.dark
                                      })
                    }
                }
            }

            return {
                graphData: {
                    nodes: [
                        {
                            id: DEVELOPER_PC_ID,
                            name: "Developer PC",
                            position: 'top-center',
                            val: 5,
                            color: '#49c9cc'
                        },
                        {
                            id: REGISTRY_ID,
                            name: "Registry",
                            position: "center-left",
                            val: 7,
                            color: "#cc7078",
                        },
                        ...newNodes
                    ],
                    links: newLinks,
                }
            }
        })
    }

    setLocalImages(images) {
        this.setState(({ graphData: { nodes, links } }) => {
            const newNodes = [];
            const newLinks = links.filter(link => !/local-image-.*/.test(link.source));
            for(let node of nodes) {
                if(!node.localImage || images.indexOf(node.localImage) !== -1) {
                    newNodes.push(node);
                }
            }
            const currImageIds = nodes.filter(n => !!n.localImage).map(n => n.localImage);
            for(let image of images) {
                if(currImageIds.indexOf(image) === -1) {
                    newNodes.push({
                        id: 'local-image-'+image,
                        localImage: image,
                        name: 'Image ' + image + ':latest',
                        val: 3,
                        color: '#5cb9cc',
                    });
                    newLinks.push({
                        source: 'local-image-'+image,
                        target: DEVELOPER_PC_ID,
                        color: palette.primary.text.dark,
                    });
                }
            }
            return {
                graphData: {
                    nodes: newNodes,
                    links: newLinks,
                }
            }
        });
    }

    setPushedImages(images) {
        this.setState(({ graphData: { nodes, links } }) => {
            const newNodes = [];
            const newLinks = links.filter(link => !/pushed-image-.*/.test(link.source));
            for(let node of nodes) {
                if(!node.pushedImage || images.indexOf(node.pushedImage) !== -1) {
                    newNodes.push(node);
                }
            }
            const currImageIds = nodes.filter(n => !!n.pushedImage).map(n => n.pushedImage);
            for(let image of images) {
                if(currImageIds.indexOf(image) === -1) {
                    newNodes.push({
                                      id: 'pushed-image-'+image,
                                      pushedImage: image,
                                      name: 'Image ' + image + ':latest',
                                      val: 3,
                                      color: '#5cb9cc',
                                  });
                    newLinks.push({
                                      source: 'pushed-image-'+image,
                                      target: REGISTRY_ID,
                                      color: palette.primary.text.dark,
                                  });
                }
            }
            return {
                graphData: {
                    nodes: newNodes,
                    links: newLinks,
                }
            }
        });
    }

    getPushedImages() {
        return this.state.graphData.nodes.filter(n => !!n.pushedImage).map(n => n.pushedImage)
    }

    setDeployedImages(images) {
        this.setState(({ graphData: { nodes, links } }) => {
            const newNodes = [];
            const newLinks = links.filter(link => !/deployed-image-.*/.test(link.source));
            for(let node of nodes) {
                if(!node.deployedImage || images.indexOf(node.deployedImage) !== -1) {
                    newNodes.push(node);
                }
            }
            const currImageIds = nodes.filter(n => !!n.deployedImage).map(n => n.deployedImage);
            for(let i = 0; i < images.length; i++) {
                let image = images[i];
                let machineId = 'machine-'+this.props.machines[i % this.props.machines.length].name;
                if(currImageIds.indexOf(image) === -1) {
                    newNodes.push({
                                      id: 'deployed-image-'+image,
                                      deployedImage: image,
                                      name: 'Pod running ' + image + ':latest',
                                      val: 3,
                                      color: '#cc7744',
                                  });
                    newLinks.push({
                                      source: 'deployed-image-'+image,
                                      target: machineId,
                                      color: palette.primary.text.dark,
                                  });
                }
            }
            return {
                graphData: {
                    nodes: newNodes,
                    links: newLinks,
                }
            }
        });
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
                if (node.x - node.val < -.16 * diagram.state.width) {
                    node.vx += 10 * alpha;
                } else if (node.x + node.val > .16 * diagram.state.width) {
                    node.vx -= 10 * alpha;
                }
                if (node.y - node.val < -.16 * diagram.state.height) {
                    node.vy += 10 * alpha;
                } else if (node.y + node.val > .16 * diagram.state.height) {
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

        this.setupInitialGraph();
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
                nodeCanvasObject={(node, ctx, globalScale) => {
                    //draw circle
                    ctx.fillStyle = node.color;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, node.val * globalScale, 0,
                            2 * Math.PI);
                    ctx.fill();

                    const fontSize = 20 / globalScale;
                    ctx.font = `${fontSize}px Montserrat, sans-serif`;

                    const textWidth = ctx.measureText(node.name).width;
                    const bckgDimensions = [textWidth, fontSize].map(
                        n => n + fontSize * 0.25);

                    ctx.fillStyle = 'rgba(30, 30, 30, 0.8)';
                    ctx.fillRect(
                        node.x - bckgDimensions[0] / 2,
                        node.y - (bckgDimensions[1] / 2),
                        ...bckgDimensions
                    );

                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.textAlign = "center";
                    ctx.textBaseline = 'middle';
                    ctx.fillText(node.name, node.x, node.y);
                }}
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