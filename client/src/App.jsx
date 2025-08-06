import { Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/auth/register" element={<RegisterPage />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/properties" element={<Properties />} />
			</Routes>
		</>
	);
}

export default App;
