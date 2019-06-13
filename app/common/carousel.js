import React from 'react';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
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
            <Button size="small" onClick={handleNext}
                    disabled={activeStep === maxSteps - 1}>
                <KeyboardArrowLeft/> Next
            </Button>
            <SwipeableViews
                axis='x'
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
            >
                {props.panels.map((panel, idx) => <div key={idx}>{panel}</div>)}
            </SwipeableViews>
            <Button size="small" onClick={handleBack}
                    disabled={activeStep === 0}>
                Back <KeyboardArrowLeft/>
            </Button>
        </div>
    );
}

export default SwipeableTextMobileStepper;
