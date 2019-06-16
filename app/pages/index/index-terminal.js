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

function sanicHelp() {
    return {
        outputs: [OutputFactory.makeTextOutput(helpMessage)]
    }
}

function sanicBuildCommand(state, opts) {
    return sanicHelp(); //TODO
}

function sanicDeployCommand(state, opts) {
    return sanicHelp(); //TODO
}

function sanicEnvCommand(state, opts) {
    return sanicHelp(); //TODO
}

function sanicCommand(state, opts) {
    if (opts.length === 0) {
        return sanicHelp();
    }
    let subcommand = opts[0];
    opts.shift();
    switch (subcommand) {
        case "build":
            return sanicBuildCommand(state, opts);
        case "deploy":
            return sanicDeployCommand(state, opts);
        case "env":
            return sanicEnvCommand(state, opts);
    }
    return sanicHelp();
}

function generateState() {
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
                'function': sanicCommand,
                'optDef': {}
            }
        });

    return EmulatorState.create(
        {
            'fs': fs,
            'commandMapping': commandMapping
        })
}

export default function (props) {
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
                emulatorState={generateState()}
            />
        </div>
    )
}
