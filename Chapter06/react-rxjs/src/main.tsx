import ReactDOM from "react-dom/client";
import App from "./App";
import { worker } from "./mocks/browser";
import "./index.css";

if (process.env.NODE_ENV === "development") {
  worker
    .start({
      onUnhandledRequest: "bypass", // Optional: Let real requests pass through if not mocked
    })
    .then(() => {
      ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
    });
}
