import "bulma/css/bulma.min.css";
import "bulma-switch/dist/css/bulma-switch.min.css";
import "bulma-slider/dist/css/bulma-slider.min.css";
import "bulma-checkradio/dist/css/bulma-checkradio.min.css";
import "./styles/index.scss";
import { AppRouter } from "./appRouter";
import { BrowserRouter } from "react-router-dom";

import store from "./redux/store";
import { Provider } from "react-redux";

const App = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </BrowserRouter>
  );
};

export default App;
