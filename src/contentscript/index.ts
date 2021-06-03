import unique from 'unique-selector';
import { getSelectors, addSelector } from './utils';
console.log('this is content script');

let markedMode = 0;

function addCSS() {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = '.outline-yellow{outline: yellow dashed 5px} .outline-red{outline:red dashed 2px}';
    document.getElementsByTagName('head')[0].appendChild(styleElement);
}

function hoverDecorator(event: MouseEvent) {
    const hoveredElement = <HTMLElement>event.target;
    hoveredElement.classList.add('outline-yellow');
    hoveredElement.addEventListener('mouseout', function () {
        hoveredElement.classList.remove('outline-yellow');
    });
}

async function saveElement(event: MouseEvent) {
    event.preventDefault();
    const clickedElement = <HTMLElement>event.target;
    const selector = unique(clickedElement, { excludeRegex: RegExp('outline-yellow|outline-red') });
    addSelector(selector);
    if (markedMode === 1) {
        markElement(clickedElement);
    }
}

async function markAllElements() {
    const currentUrlSelectors = await getSelectors();
    for (const selector of currentUrlSelectors) {
        const htmlElement = <HTMLElement>document.querySelector(selector);
        if (!htmlElement) continue;
        markElement(htmlElement);
    }
}

function markElement(element: HTMLElement) {
    element.classList.add('outline-red');
}

async function unMarkAllElements() {
    const selectors = await getSelectors();
    for (const selector of selectors) {
        const element = <HTMLElement>document.querySelector(selector);
        element.classList.remove('outline-red');
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function listenToMessages(): void {
    chrome.runtime.onMessage.addListener((message) => {
        if ('selectorMode' in message) {
            if (message['selectorMode'] === 1) {
                //Add hovering effect
                document.body.addEventListener('mouseover', hoverDecorator);
                document.body.addEventListener('click', saveElement);
            } else {
                //Remove hovering effect
                document.body.removeEventListener('mouseover', hoverDecorator);
                document.body.removeEventListener('click', saveElement);
            }
        }
        if ('markedMode' in message) {
            markedMode = message['markedMode'];
            if (markedMode === 1) markAllElements();
            else unMarkAllElements();
        }
    });
}

listenToMessages();
window.onload = function () {
    addCSS();
};
// listenAndRespond();
export {};
