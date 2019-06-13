import React from 'react';
import ReactDOM from 'react-dom';
import Carousel from '../../common/carousel';
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
                    background: '#18181d',
                    promptSymbolColor: '#acc1cf',
                    commandColor: '#acc1cf',
                    outputColor: '#acc1cf',
                    errorOutputColor: '#ff4a4a',
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