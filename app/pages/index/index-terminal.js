import React from "react";
import palette from "../../common/palette";
import ReactTerminal from "react-terminal-component";
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

export default class IndexTerminal extends React.Component {
    sanicHelp() {
        return {
            outputs: [OutputFactory.makeTextOutput(helpMessage)]
        }
    }

    sanicBuildCommand(state, opts) {
        return this.sanicHelp(); //TODO
    }

    sanicDeployCommand(state, opts) {
        return this.sanicHelp(); //TODO
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
        this.props.setEnv(opts[0]);
        return [OutputFactory.makeTextOutput(
            "The environment is now "+opts[0]+". Notice: build & deploy commands will now affect the registry & machines for this environment."
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
                        height: '9.6em',
                    }}
                    inputStr='sanic env prod'
                    emulatorState={this.generateState()}
                />
            </div>
        )
    }
}
