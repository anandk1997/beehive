import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy } from "react";

import { Loader } from "./components/Loader";
import { Providers } from "./Contexts/Providers";

const BeaconList = lazy(() => import("./Pages/WalkList"));
const Beacon = lazy(() => import("./Pages/WalkList/[id]"));
const BeaconReplay = lazy(() => import("./Pages/WalkList/[id]/Replay/index"));

const DefaultLayout = lazy(() => import("./layout/DefaultLayout"));

const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Router>
        <Providers>
          <Routes>
            <Route element={<DefaultLayout />}>
              <Route path="/" element={<BeaconList />} />
              <Route path="/beacon/:id" element={<Beacon />} />
              <Route path="/beacon-replay/:id" element={<BeaconReplay />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Routes>
        </Providers>
      </Router>
    </Suspense>
  );
};

export default App;
