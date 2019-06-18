import React from "react";
import palette from "../../common/palette";
import {ReactTerminalStateless} from "react-terminal-component";
import {
    CommandMapping,
    defaultCommandMapping,
    EmulatorState,
    FileSystem,
    OutputFactory
} from "javascript-terminal";

const helpMessage = `
NAME:
   sanic - build & deploy kubernetes monorepos

COMMANDS:
     build    build some (or all, by default) services
     deploy   deploy some (or all, by default) services
     env      change to a specific (e.g., dev or production) environment
     help, h  Shows a list of commands
`.trim();

const sanicYaml = `
environments:
  dev:
    clusterProvisioner: localdev
    commands:
    - name: print_hello
      command: "echo hello"
`.trim();

class NoScrollTerminal extends ReactTerminalStateless {
    //TODO HACK: scroll is really jumpy and confusing without this
    //remove when https://github.com/rohanchandra/react-terminal-component/pull/17 is merged
    componentDidUpdate() {
        let input = document.querySelector(".terminalContainer");
        if(input) {
            input.scrollTop = input.scrollHeight;
        }
    }
}

export default class IndexTerminal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            emulatorState: this.generateState()
        };
        this.terminalRef = React.createRef();
    }

    sanicHelp() {
        return {
            outputs: [OutputFactory.makeTextOutput(helpMessage)]
        }
    }

    sanicBuildCommand(state, opts) {
        if (opts.length > 1 || (opts.length === 1 && opts[0] !== '--push')) {
            return {
                outputs: [OutputFactory.makeTextOutput(
                    "Usage: sanic build (--push)"
                )]
            }
        }
        let push = (opts.length === 1 && opts[0] === '--push');
        let builtServices = this.props.onBuild(push);
        return {
            outputs: [OutputFactory.makeTextOutput(
                "Built "
                + builtServices.join(", ")
                + (push ? ", pushed them and to the registry"
                        : ", and stored them to the local docker daemon.\nTry sanic build --push as well.")
            )]
        }
    }

    sanicDeployCommand(state, opts) {
        if(opts.length !== 0) {
            return {
                outputs: [OutputFactory.makeTextOutput("Usage: sanic deploy")]
            }
        }
        let deployedImages = this.props.onDeploy();
        if(deployedImages.length === 0) {
            return {
                outputs: [OutputFactory.makeTextOutput("You need to build and push images before you can deploy them. Try 'sanic build --push'")]
            }
        }
        return {
            outputs: [OutputFactory.makeTextOutput(
                "Deployed pods running the following images: "
                + deployedImages.join(", ")
            )]
        }
    }

    sanicEnvCommand(state, opts) {
        if (opts.length !== 1 || !this.props.validEnvs.includes(opts[0])) {
            return {
                outputs: [OutputFactory.makeTextOutput(
                    "Usage: sanic env ["
                    + this.props.validEnvs.join("|")
                    + "]"
                )]
            }
        }
        this.props.onEnv(opts[0]);
        return [OutputFactory.makeTextOutput(
            "The environment is now " + opts[0]
            + ". Notice: build & deploy commands will now affect the registry & machines for this environment."
        )]
    }

    sanicCommand(state, opts) {
        try {
            if (opts.length === 0) {
                return this.sanicHelp();
            }
            let subcommand = opts[0];
            opts.shift();
            switch (subcommand) {
                case "build":
                    return this.sanicBuildCommand(state, opts);
                case "deploy":
                    return this.sanicDeployCommand(state, opts);
                case "env":
                    return this.sanicEnvCommand(state, opts);
            }
        } catch (e) {
            console.error(e.message);
            console.trace();
        }
        return this.sanicHelp();
    }

    generateState() {
        let fs = FileSystem.create(
            {
                '/sanic-example': {},
                '/sanic-example/sanic.yaml': {
                    content: sanicYaml
                },
            });

        let commandMapping = CommandMapping.create(
            {
                ...defaultCommandMapping,
                'sanic': {
                    'function': this.sanicCommand.bind(this),
                    'optDef': {}
                }
            });

        return EmulatorState.create(
            {
                'fs': fs,
                'commandMapping': commandMapping
            })
    }

    render() {
        return (
            <div style={{
                backgroundColor: palette.primary.background.dark,
                paddingTop: '0.3em',
                paddingBottom: '0.3em',
            }}>
                <NoScrollTerminal
                    autoFocus={false}
                    clickToFocus={true}
                    promptSymbol={'[' + this.props.env + '] demo$'}
                    ref={this.terminalRef}
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
                        height: '9.6em',
                    }}
                    onInputChange={(inputStr) => this.setState({inputStr})}
                    inputStr={this.state.inputStr}
                    onStateChange={(emulatorState) => this.setState({emulatorState, inputStr: ''})}
                    emulatorState={this.state.emulatorState}
                />
            </div>
        )
    }
}
