// @ts-ignore: allow unresolved module types in this environment
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
// @ts-ignore: allow importing CSS without type declarations
import "./styles/index.css";

// Resolve background image URL via import.meta so bundler handles it
const bgUrl = new URL('./img/p.jpeg', import.meta.url).href;

// Apply background to html element (covers entire viewport and sits behind app)
const html = document.documentElement;
html.style.backgroundImage = `url(${bgUrl})`;
html.style.backgroundSize = "cover";
html.style.backgroundPosition = "center";
html.style.backgroundRepeat = "no-repeat";
html.style.backgroundAttachment = "fixed";

createRoot(document.getElementById("root")!).render(<App />);
  