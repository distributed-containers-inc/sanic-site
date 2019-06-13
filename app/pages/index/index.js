import React from 'react';
import ReactDOM from 'react-dom';
import Carousel from '../../common/carousel';
import palette from '../../common/palette';
import ReactTerminal from 'react-terminal-component';

function SanicFeatures() {
    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <Carousel variant="contained" color="primary" panels={[
                    <h2 style={{textAlign: 'center'}}>A rich environment system</h2>,
                    <h2 style={{textAlign: 'center'}}>A rich environment system</h2>,
                    <h2 style={{textAlign: 'center'}}>A rich environment system</h2>,
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
                        width: 'inherit',
                        height: '6em',
                    }}
                />
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                flex: '0 1 auto'
            }}>
                dev<br />staging<br />prod<br />
            </div>
        </div>
    );
}

ReactDOM.render(
    <SanicFeatures/>,
    document.querySelector('#sanic-features-interactive')
);