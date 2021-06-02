import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { sendMessageToContentScript } from './utils/chrome.message';

require('./index.scss');

function App() {
    const [selectorMode, setSelectorMode] = useState(0);

    useEffect(function () {
        //Get Selector Mode From Store On First Render
        chrome.storage.sync.get(function (config) {
            if (config['selectorMode']) {
                setSelectorMode(config['selectorMode']);
            } else {
                chrome.storage.sync.set({ selectorMode });
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

    return (
        <div className="main">
            <p>Selector Status:</p>
            <select onChange={(e) => setSelectorMode(parseInt(e.target.value))} value={selectorMode}>
                <option value={1}>On</option>
                <option value={0}>Off</option>
            </select>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
