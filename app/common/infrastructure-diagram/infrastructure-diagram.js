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
                {id: 1, name: "node 1"},
                {id: 2, name: "node 2"},
                {id: 3, name: "node 3"}],
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

    componentDidMount() {
        this.updateDimensions();
        this.containerRef.current.addEventListener("resize", this.updateDimensions)
    }

    componentWillUnmount() {
        this.containerRef.current.removeEventListener("resize", this.updateDimensions)
    }

    render() {
        const canvas =  (
            <ForceGraph2D
                ref={this.graphRef}
                width={this.state && this.state.width || window.outerWidth}
                height={this.state && this.state.height || window.outerHeight}
                graphData={this.generateGraphData()}
                enableNavigationControls={false}
                enableZoomPanInteraction={false}
            />
        );

        return (
            <div ref={this.containerRef}
                 style={{width: '100%', height: '30em', backgroundColor: palette.primary.background.main, content: 'border-box', paddingTop: '1em'}}>
                {this.props.title ? (
                    <h2 style={{textAlign: 'center', width: '100%', margin: '0'}}>{this.props.title}</h2>
                ): null}
                {canvas}
            </div>
        )
    }
}

export default InfrastructureDiagram