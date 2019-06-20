import React from 'react';
import ReactDOM from 'react-dom';
import IndexTerminal from './index-terminal';
import {InfrastructureDiagram} from '../../common/infrastructure-diagram';
import SwipableCarousel from '../../common/carousel';
import {TUTORIAL_STEPS, INITIAL_STEP} from './tutorial-steps';
import IndexClusterData from './index-cluster-data'

class SanicFeatures extends React.Component {
    constructor(props) {
        super(props);

        this.terminalRef = React.createRef();
        this.carouselRef = React.createRef();
        this.environmentRefs = {};
        for(let environment of IndexClusterData.environments) {
            this.environmentRefs[environment.name] = React.createRef();
        }

        this.state = {
            currEnv: 0,
            currTutorialStep: INITIAL_STEP,
        };
    }

    currentEnvironment() {
        return IndexClusterData.environments[this.state.currEnv];
    }

    currentEnvironmentDiagram() {
        return this.environmentRefs[this.currentEnvironment().name].current;
    }

    render() {
        return (
            <div
                style={{display: 'flex', flexDirection: 'column'}}
                onClick={(e) => {
                    e.currentTarget.scrollIntoView();
                }}
            >
                <IndexTerminal
                    ref={this.terminalRef}
                    env={this.currentEnvironment().name}
                    validEnvs={IndexClusterData.environments.map(e => e.name)}
                    onEnv={(envName) => {
                        let i = 0;
                        for (let env of IndexClusterData.environments) {
                            if (env.name === envName) {
                                this.carouselRef.current.setState({step: i});
                                this.setState({currEnv: i});
                            }
                            i++;
                        }
                    }}
                    onBuild={(doPush) => {
                        if(doPush) {
                            this.currentEnvironmentDiagram().setPushedImages(IndexClusterData.images);
                        } else {
                            //local push updates all of the diagrams
                            for(let envName in this.environmentRefs) {
                                this.environmentRefs[envName].current.setLocalImages(IndexClusterData.images);
                            }
                        }
                        return IndexClusterData.images;
                    }}
                    onDeploy={() => {
                        this.currentEnvironmentDiagram().setDeployedImages(
                            this.currentEnvironmentDiagram().getPushedImages()
                        );
                        return this.currentEnvironmentDiagram().getPushedImages() || [];
                    }}
                    plugins={[{
                        onExecuteStarted: (state, cmd) => {
                            let step = TUTORIAL_STEPS[this.state.currTutorialStep];
                            if(step.started && step.started(state, cmd)) {
                                this.setState({currTutorialStep: step.started(state, cmd)});
                            }
                        },
                        onExecuteCompleted: (state) => {
                            let step = TUTORIAL_STEPS[this.state.currTutorialStep];
                            if(step.completed && step.completed(state)) {
                                this.setState({currTutorialStep: step.completed(state)});
                            }
                        }
                    }]}
                />
                <SwipableCarousel
                    ref={this.carouselRef}
                    onChangeIndex={(step) => this.setState({currEnv: step})}
                >
                    {IndexClusterData.environments.map(env => (
                        <InfrastructureDiagram
                            title={"Current environment: " + this.currentEnvironment().name}
                            subtext={TUTORIAL_STEPS[this.state.currTutorialStep].text}
                            machines={env.machines}
                            key={env.name}
                            ref={this.environmentRefs[env.name]}
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