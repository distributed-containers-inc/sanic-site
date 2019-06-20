import React from 'react';

function cwd(state) {
    return state.getEnvVariables().get('cwd');
}

//The tutorial is implemented as a finite state machine.
const TUTORIAL_STEPS = {
    "EXPLORING_FILESYSTEM": {
        text: 'This is a single minute, interactive tutorial for sanic. Type "ls" into the terminal above.',
        started: (state, cmd) => {
            if (/^\s*ls(\s*\/*)*\s*$/.test(cmd)) {
                return "EXPLORING_DOCKERFILE";
            }
        }
    },
    "EXPLORING_DOCKERFILE": {
        text: 'The three directories here contain Dockerfiles, check one of their contents with "cat api/Dockerfile"',
        started: (state, cmd) => {
            if (/^\s*cat.*Dockerfile\s*$/.test(cmd)) {
                return "BUILDING_LOCALLY";
            }
        }
    },
    "BUILDING_LOCALLY": {
        text: 'Sanic discovers all Dockerfiles in the project directory by default. Try "sanic build" to build them.',
        started: (state, cmd) => {
            if (/^\s*sanic\s*build\s*$/.test(cmd)) {
                return "BUILDING_AND_PUSHING_DEV";
            }
        }
    },
    "BUILDING_AND_PUSHING_DEV": {
        text: 'Sanic also handles pushing to registries. Push to the development registry with "sanic build --push"',
        started: (state, cmd) => {
            if (/^\s*sanic\s*build\s*--push\s*$/.test(cmd)) {
                return "DEPLOYING_DEV";
            }
        }
    },
    "DEPLOYING_DEV": {
        text: 'Notice: The images have been pushed to the registry in the diagram below. Deploy the images as pods for development with "sanic deploy"',
        started: (state, cmd) => {
            if (/^\s*sanic\s*deploy\s*$/.test(cmd)) {
                return "SWITCH_ENVS";
            }
        }
    },
    "SWITCH_ENVS": {
        text: "Now that you've deployed locally, let's repeat the process for staging. Switch into the staging environment with 'sanic env staging'",
        started: (state, cmd) => {
            if (/^\s*sanic\s*env\s*staging\s*$/.test(cmd)) {
                return "BUILDING_AND_PUSHING_STAGING";
            }
        }
    },
    "BUILDING_AND_PUSHING_STAGING": {
        text: 'Build and push to the staging registry with sanic build --push',
        started: (state, cmd) => {
            if (/^\s*sanic\s*build\s*--push\s*$/.test(cmd)) {
                return "DEPLOYING_STAGING";
            }
        }
    },
    "DEPLOYING_STAGING": {
        text: 'As in development, the images have been pushed to the staging registry. Deploy them with "sanic deploy"',
        started: (state, cmd) => {
            if (/^\s*sanic\s*deploy\s*$/.test(cmd)) {
                return "CALL_TO_ACTION"
            }
        }
    },
    "CALL_TO_ACTION": {
    text: <a href="download">That's it! Click here to download the binary and get started!</a>,
    }
};

const INITIAL_STEP = "EXPLORING_FILESYSTEM";

export {TUTORIAL_STEPS, INITIAL_STEP};