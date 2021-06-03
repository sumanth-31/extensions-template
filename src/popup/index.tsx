import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { sendMessageToContentScript } from './utils/chrome.message';

require('./index.scss');

function App() {
    const [selectorMode, setSelectorMode] = useState(0);
    const [markedMode, setMarkedMode] = useState(0);
    useEffect(function () {
        //Get Selector Mode From Store On First Render
        chrome.storage.sync.get(function (config) {
            if ('selectorMode' in config) {
                setSelectorMode(config['selectorMode']);
            } else {
                chrome.storage.sync.set({ selectorMode });
            }
            if ('markedMode' in config) {
                setMarkedMode(config['markedMode']);
            } else {
                chrome.storage.sync.set({ markedMode });
            }
        });
    }, []);

    useEffect(
        //Change value in store whenever popup select is changed
        function () {
            chrome.storage.sync.set({ selectorMode });
            sendMessageToContentScript({ selectorMode });
        },
        [selectorMode],
    );
    useEffect(
        function () {
            chrome.storage.sync.set({ markedMode });
            sendMessageToContentScript({ markedMode });
        },
        [markedMode],
    );

    return (
        <div className="main">
            <h4>Element Selector</h4>
            <div>
                <p>Selector Status:</p>
                <select onChange={(e) => setSelectorMode(parseInt(e.target.value))} value={selectorMode}>
                    <option value={1}>On</option>
                    <option value={0}>Off</option>
                </select>
            </div>
            <div>
                <p>Marker Status:</p>
                <select onChange={(e) => setMarkedMode(parseInt(e.target.value))} value={markedMode}>
                    <option value={1}>On</option>
                    <option value={0}>Off</option>
                </select>
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
