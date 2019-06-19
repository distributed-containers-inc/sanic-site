import React from 'react';

//The tutorial is implemented as a finite state machine.
const TUTORIAL_STEPS = {
    "EXPLORING_FILESYSTEM": {
        text: 'This is an interactive demo of Sanic. Try "ls" in the terminal above.',
        transition: (state, cmd) => {
            if (/\s*ls(\s*\/*)*/.test(cmd)) {
                return "ENTERING_PROJECT_DIR";
            }
        }
    },
    "ENTERING_PROJECT_DIR": {
        text: 'Notice: There is a project directory here named sanic-example. Enter it with "cd sanic-example"',
        transition: (state, cmd) => {
            console.log(state);
        }
    },
    "EXPLORING_DOCKERFILE": {
        text: 'The three directories here contain Dockerfiles, check one of their contents with "cat api/Dockerfile"',

    },
};

const INITIAL_STEP = "EXPLORING_FILESYSTEM";

export {TUTORIAL_STEPS, INITIAL_STEP};