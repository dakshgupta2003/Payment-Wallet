import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store.jsx";
import LoadSpinner from "./components/LoadSpinner.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    {/* every component in the app will be able to access the store  */}
    <LoadSpinner/>
    <StrictMode>
      <App />
    </StrictMode>
  </Provider>
);
