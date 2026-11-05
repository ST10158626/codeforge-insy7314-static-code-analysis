import { render, screen, cleanup } from "@testing-library/react";
import { describe, expect, it, afterEach } from "vitest";
import App from "../App";
import { AuthProvider } from "../context/AuthContext";

function renderApp() {
return render(
<AuthProvider>
<App />
</AuthProvider>
);
}

afterEach(() => {
cleanup();
});

describe("HustleHub+ frontend", () => {
it("renders the public home page", () => {
renderApp();

    expect(
        screen.getByRole("heading", { name: /hustlehub\+/i })
    ).toBeInTheDocument();

    expect(
        screen.getByText(/connecting clients with freelancers/i)
    ).toBeInTheDocument();
});

it("provides navigation to account registration", () => {
    renderApp();

    expect(
        screen.getByRole("link", { name: /register|sign up|create account/i })
    ).toBeInTheDocument();
});

});