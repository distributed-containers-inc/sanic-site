import React from 'react';
import ReactDOM from 'react-dom';
import Carousel from '../../common/carousel';

function SanicFeatures() {
    return (
        <div className="content">
        <Carousel variant="contained" color="primary" panels={[
            <div>panel 1</div>,
            <div>panel 2</div>,
            <div>panel 3</div>,
        ]}/>
        </div>
    );
}

ReactDOM.render(<SanicFeatures />, document.querySelector('#sanic-features-interactive'));