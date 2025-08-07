function appendToLocalStorage(key, newEntry) {
    
    let existing = localStorage.getItem(key);
    let data = [];

    if (existing) {
        try {
            data = JSON.parse(existing);
        } catch (e) {
            console.warn("Error parsing localStorage data:", e);
        }
    }

    // 2. Append the new entry
    data.push(newEntry);

    // 3. Save back
    localStorage.setItem(key, JSON.stringify(data));
    window.parent.postMessage({ type: "localStorageData", key: key, val: JSON.stringify(data) }, "*");
}

function setToLocalStorage(key, newEntry) {
    localStorage.setItem(key, JSON.stringify(newEntry));
    window.parent.postMessage({ type: "localStorageData",  key: key, val: JSON.stringify(newEntry) }, "*");
}

function readFromLocalStorage(key, newEntry) {
    return localStorage.getItem(key);
}