import { Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/auth/register" element={<RegisterPage />} />
			</Routes>
		</>
	);
}

export default App;
