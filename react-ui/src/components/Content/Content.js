import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Container from './components/Container';
import Sidebar from './components/Sidebar';

function Content() {
    console.log('Rendering => Content');
    return (
        <div className="app-main">
            <Router>
                <Sidebar />
                <Container />
            </Router>
        </div>
    )
}

export default Content;
