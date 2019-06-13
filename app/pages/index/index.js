import React from 'react';
import ReactDOM from 'react-dom';
import Carousel from '../../common/carousel';
import palette from '../../common/palette';
import ReactTerminal from 'react-terminal-component';

function SanicFeatures() {
    return (
        <div className="content column">
            <Carousel variant="contained" color="primary" panels={[
                <h2>A rich environment system</h2>,
                <div>panel 2</div>,
                <div>panel 3</div>,
            ]}/>
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
                    width: '40em',
                    height: '6em',
                }}
            />
        </div>
    );
}

ReactDOM.render(<SanicFeatures/>,
    document.querySelector('#sanic-features-interactive'));