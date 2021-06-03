interface ISaveElements {
    [key: string]: string[];
}

export function getSelectors(): Promise<string[]> {
    return new Promise<string[]>(function (res) {
        const currentUrl = window.location.href;
        chrome.storage.sync.get(function (store) {
            let savedElements: ISaveElements = {};
            if ('savedElements' in store) {
                savedElements = store['savedElements'];
            }
            let currentUrlElements: string[] = [];
            if (currentUrl in savedElements) currentUrlElements = savedElements[currentUrl];
            return res(currentUrlElements);
        });
    });
}

export function addSelector(selector: string): void {
    const currentUrl = window.location.href;
    chrome.storage.sync.get(function (store) {
        let savedElements: ISaveElements = {};
        if ('savedElements' in store) {
            savedElements = store['savedElements'];
        }
        let currentUrlElements: string[] = [];
        if (currentUrl in savedElements) currentUrlElements = savedElements[currentUrl];
        if (selector in currentUrlElements) return;
        currentUrlElements.push(selector);
        savedElements[currentUrl] = currentUrlElements;
        chrome.storage.sync.set({ savedElements: savedElements });
    });
}
