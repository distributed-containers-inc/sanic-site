import React from 'react';
import ReactDOM from 'react-dom';
import IndexTerminal from './index-terminal';
import {InfrastructureDiagram} from '../../common/infrastructure-diagram';
import SwipableCarousel from '../../common/carousel';

class SanicFeatures extends React.Component {
    environments = [
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
                    "name": "Production server #1"
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

    images = ["web", "api", "redis"];
    pushedImages = [];

    constructor(props) {
        super(props);

        this.terminalRef = React.createRef();
        this.carouselRef = React.createRef();
        for(let environment of this.environments) {
            environment.diagramRef = React.createRef();
        }

        this.state = {
            currentEnv: 0
        }
    }

    currentEnvironment() {
        return this.environments[this.state.currentEnv];
    }

    currentEnvironmentDiagram() {
        return this.currentEnvironment().diagramRef.current;
    }

    tutorialText() {
        return "Environment: " + this.environments[this.state.currentEnv].name
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
                    validEnvs={this.environments.map(e => e.name)}
                    onEnv={(envName) => {
                        let i = 0;
                        for (let env of this.environments) {
                            if (env.name === envName) {
                                this.carouselRef.current.setState({step: i});
                                this.setState({currentEnv: i});
                            }
                            i++;
                        }
                    }}
                    onBuild={(doPush) => {
                        if(doPush) {
                            this.currentEnvironmentDiagram().setPushedImages(this.images);
                            this.currentEnvironment().pushedImages = this.images;
                        } else {
                            //local push updates all of the diagrams
                            for(let env of this.environments) {
                                env.diagramRef.current.setLocalImages(this.images);
                            }
                        }
                        return this.images;
                    }}
                    onDeploy={() => {
                        this.currentEnvironmentDiagram().setDeployedImages(
                            this.currentEnvironment().pushedImages
                        );
                        return this.currentEnvironment().pushedImages || [];
                    }}
                />
                <SwipableCarousel
                    ref={this.carouselRef}
                    onChangeIndex={(step) => this.setState({currentEnv: step})}
                >
                    {this.environments.map(env => (
                        <InfrastructureDiagram
                            title={this.tutorialText()}
                            machines={env.machines}
                            key={env.name}
                            ref={env.diagramRef}
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