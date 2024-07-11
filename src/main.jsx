import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store";
import "simplebar-react/dist/simplebar.min.css";
import "../src/assets/scss/app.scss";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";

document.body.classList.add("dark");
const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <App />
    </Provider>
  </QueryClientProvider>
);
