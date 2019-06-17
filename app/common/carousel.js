import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import palette from './palette';

class SwipeableTextMobileStepper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0
        }
    }

    handleNext() {
        this.setState(prevState => ({step: prevState.step+1}));
    }

    handleBack() {
        this.setState(prevState => ({step: prevState.step-1}));
    }

    handleStepChange(step) {
        this.setState({step: step});
        if(this.props.onChangeIndex) {
            this.props.onChangeIndex.call(arguments);
        }
    }

    render() {
        return (
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <button onClick={() => this.handleBack()}
                        disabled={this.state.step === 0}
                        style={{
                            backgroundColor: palette.primary.background.main,
                            color: palette.primary.text.main,
                            border: '0'
                        }}>
                    &lt;
                </button>
                <SwipeableViews
                    axis='x'
                    index={this.state.step}
                    onChangeIndex={() => this.handleStepChange}
                    enableMouseEvents
                    style={{width: '100%'}}
                    animateHeight={true}
                >
                    {this.props.children}
                </SwipeableViews>
                <button onClick={() => this.handleNext()}
                        disabled={this.state.step === this.props.children.length}
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
}

export default SwipeableTextMobileStepper;
