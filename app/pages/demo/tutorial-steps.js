import React from 'react';

//The tutorial is implemented as a finite state machine.
const TUTORIAL_STEPS = {
    "EXPLORING_FILESYSTEM": {
        text: 'This is a single minute, interactive tutorial for Sanic. Let\'s get started: Type "ls" into the terminal above.',
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
        text: 'When building, Sanic discovers all Dockerfiles in the project directory by default. Try "sanic build" to build some images.',
        started: (state, cmd) => {
            if (/^\s*sanic\s*build\s*$/.test(cmd)) {
                return "BUILDING_AND_PUSHING_DEV";
            }
        }
    },
    "BUILDING_AND_PUSHING_DEV": {
        text: 'Observe: In the graph below, some images have been added to the developer machine. Push to the development registry with "sanic build --push"',
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
        text: "Pods have been created from the source code on your local computer.  Now, let's repeat the process for the staging environment. Switch into it with 'sanic env staging'",
        started: (state, cmd) => {
            if (/^\s*sanic\s*env\s*staging\s*$/.test(cmd)) {
                return "BUILDING_AND_PUSHING_STAGING";
            }
        }
    },
    "BUILDING_AND_PUSHING_STAGING": {
        text: 'Locally built images persist across environments, so let\'s skip that step and instead build and push to the staging registry with sanic build --push',
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
        text: <p>Deploying has created pods in the staging environment. Want to use sanic to deploy your own Kubernetes project? <a href="download">Click here to download Sanic!</a></p>,
    }
};

const INITIAL_STEP = "EXPLORING_FILESYSTEM";

export {TUTORIAL_STEPS, INITIAL_STEP};