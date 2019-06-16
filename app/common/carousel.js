import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import palette from './palette';

function SwipeableTextMobileStepper(props) {
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = props.children.length;

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
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <button onClick={handleBack}
                    disabled={activeStep === 0}
                    style={{
                        backgroundColor: palette.primary.background.main,
                        color: palette.primary.text.main,
                        border: '0'
                    }}>
                &lt;
            </button>
            <SwipeableViews
                axis='x'
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
                style={{width: '100%'}}
                animateHeight={true}
            >
                {props.children}
            </SwipeableViews>
            <button onClick={handleNext}
                    disabled={activeStep === maxSteps - 1}
                    style={{
                        backgroundColor: palette.primary.background.main,
                        color: palette.primary.text.main,
                        border: '0'
                    }}>
                &gt;
            </button>
        </div>
    );
}

export default SwipeableTextMobileStepper;
