import "@testing-library/jest-dom/vitest";
import { beforeEach } from "vitest";

// Provide browser-like localStorage for automated tests.
const storage = new Map();

const localStorageMock = {
getItem(key) {
return storage.has(String(key)) ? storage.get(String(key)) : null;
},

setItem(key, value) {
    storage.set(String(key), String(value));
},

removeItem(key) {
    storage.delete(String(key));
},

clear() {
    storage.clear();
},

key(index) {
    return Array.from(storage.keys())[index] ?? null;
},

get length() {
    return storage.size;
}

};

Object.defineProperty(globalThis, "localStorage", {
configurable: true,
value: localStorageMock
});

// Start each test with empty browser storage.
beforeEach(() => {
localStorage.clear();
});