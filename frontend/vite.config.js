import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
plugins: [
react({
jsxRuntime: "automatic"
})
],
test: {
environment: "jsdom",
environmentOptions: {
jsdom: {
url: "http://localhost:5173"
}
},
setupFiles: "./src/tests/setup.js",
clearMocks: true
}
});