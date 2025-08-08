import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import { useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./utils/ProtectedRoute";
import LoaderSpinner from "./components/common/LoaderSpinner";
import { useEffect } from "react";

function App() {
	const { user, loading } = useAuth();
	const location = useLocation();

	// Show loading spinner only during initial auth check
	if (loading && !user) {
		return <LoaderSpinner fullScreen />;
	}

	return (
		<>
			<Routes location={location} key={location.pathname}>
				<Route path="/" element={<LandingPage />} />
				<Route
					path="/auth/register"
					element={
						!user ? <RegisterPage /> : <Navigate to="/dashboard" replace />
					}
				/>
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/properties"
					element={
						<ProtectedRoute>
							<Properties />
						</ProtectedRoute>
					}
				/>
				{/* Add a catch-all route for better UX */}
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
			<Toaster position="top-center" />
		</>
	);
}

export default App;
