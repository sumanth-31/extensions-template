console.log('this is content script');

interface MessageWithResponse {
    name: string;
}

function hoverDecorator(event: MouseEvent) {
    const hoveredElement = <HTMLElement>event.target;
    const style = hoveredElement.style.outline;
    hoveredElement.style.outline = 'yellow dashed 5px';
    hoveredElement.addEventListener('mouseout', function () {
        hoveredElement.style.outline = style;
    });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function listenToMessages(): void {
    chrome.runtime.onMessage.addListener((message) => {
        if (message['selectorMode'] == 1) {
            //Add hovering effect
            document.body.addEventListener('mouseover', hoverDecorator);
        } else {
            //Remove hovering effect
            document.body.removeEventListener('mouseover', hoverDecorator);
        }
    });
}

function listenAndRespond() {
    chrome.runtime.onMessage.addListener((message: MessageWithResponse, _sender, sendResponse) => {
        console.log('Got message from CS');
        setTimeout(() => {
            sendResponse(`Hello, ${message.name}`);
        }, 1000);
        return true; // this indicates that we will send response asynchronously
    });
}

listenToMessages();
// listenAndRespond();
export {};
