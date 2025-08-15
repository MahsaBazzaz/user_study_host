// function appendToLocalStorage(key, global_key, newEntry) {
    
//     let existing = localStorage.getItem(key);
//     let data = [];

//     if (existing) {
//         try {
//             data = JSON.parse(existing);
//         } catch (e) {
//             console.warn("Error parsing localStorage data:", e);
//         }
//     }

//     // 2. Append the new entry
//     data.push(newEntry);

//     // 3. Save back
//     // localStorage.setItem(global_key, JSON.stringify(data));
//     window.parent.postMessage({ type: "localStorageData", key: global_key, val: JSON.stringify(data) }, "*");
// }

// function setToLocalStorage(key, newEntry) {
//     localStorage.setItem(key, JSON.stringify(newEntry));
//     // window.parent.postMessage({ type: "localStorageData",  key: global_key, val: JSON.stringify(newEntry) }, "*");
// }

function justsendtoparent(global_key, newEntry) {
    window.parent.postMessage({ type: "log", key: global_key, val: newEntry }, "*");
}

// function updateLocalStorage(key, global_key) {
//     let existing = parseInt(localStorage.getItem(global_key), 10) || 0;
//     existing += 1
//     localStorage.setItem(global_key, existing);
    
//     // Optional postMessage
//     window.parent.postMessage({ type: "localStorageData", key: global_key, val: existing }, "*");
// }

// function readFromLocalStorage(key, newEntry) {
//     return localStorage.getItem(key);
// }

// function removeEndingFromLocalStorage() {
//     for (let i = localStorage.length - 1; i >= 0; i--) {
//     const key = localStorage.key(i);
//     if (key && key.endsWith("key")) {
//         localStorage.removeItem(key);
//     }
// }
// }

function clearLocalStorage(){
    localStorage.removeItem("run_outcome");
    for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key.startsWith("key_count")) {
        localStorage.removeItem(key);
        i--; // adjust index since length changes after removal
    }
}
}