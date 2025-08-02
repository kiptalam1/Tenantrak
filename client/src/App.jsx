import { Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/auth/register" element={<RegisterPage />} />
				<Route path="/dashboard" element={<Dashboard />} />
			</Routes>
		</>
	);
}

export default App;
