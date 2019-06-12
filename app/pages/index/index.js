import React from 'react';
import ReactDOM from 'react-dom';
import Carousel from '../../common/carousel';

function SanicFeatures() {
    return (
        <div className="content">
        <Carousel variant="contained" color="primary">
            Hello World
        </Carousel>
        </div>
    );
}

ReactDOM.render(<SanicFeatures />, document.querySelector('#sanic-features-interactive'));