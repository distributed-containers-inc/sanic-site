import React from 'react';
import SwipeableViews from 'react-swipeable-views';

function SwipeableTextMobileStepper(props) {
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = props.panels.length;

    function handleNext() {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    }

    function handleBack() {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    }

    function handleStepChange(step) {
        setActiveStep(step);
    }

    return (
        <div>
            <button onClick={handleNext}
                    disabled={activeStep === maxSteps - 1}>
                Next
            </button>
            <SwipeableViews
                axis='x'
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
            >
                {props.panels.map((panel, idx) => <div key={idx}>{panel}</div>)}
            </SwipeableViews>
            <button onClick={handleBack}
                    disabled={activeStep === 0}>
                Back
            </button>
        </div>
    );
}

export default SwipeableTextMobileStepper;
