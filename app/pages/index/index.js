import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';

function Index() {
    return (
        <div className="content">
        <Button variant="contained" color="primary">
            Hello World
        </Button>
        </div>
    );
}

ReactDOM.render(<Index />, document.querySelector('#hello'));