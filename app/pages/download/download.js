import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';

function Download() {
    return (
        <div className="content">
        <Button variant="contained" color="primary">
            Download: Hello World
        </Button>
        </div>
    );
}

ReactDOM.render(<Download />, document.querySelector('#hello'));