import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import { useAuth } from "./contexts/AuthContext";

function App() {
	const { user } = useAuth();
	return (
		<>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route
					path="/auth/register"
					element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />}
				/>
				<Route
					path="/dashboard"
					element={user ? <Dashboard /> : <Navigate to="/" />}
				/>
				<Route
					path="/properties"
					element={user ? <Properties /> : <Navigate to="/" />}
				/>
			</Routes>
			<Toaster />
		</>
	);
}

export default App;
