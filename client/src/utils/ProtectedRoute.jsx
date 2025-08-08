import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoaderSpinner from "../components/common/LoaderSpinner";

const ProtectedRoute = ({ children }) => {
	const { user, loading } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (!loading && !user) {
			// Preserve the intended location for redirect after login
			navigate("/", {
				replace: true,
				state: { from: location },
			});
		}
	}, [user, loading, navigate, location]);

	if (loading) return <LoaderSpinner />;
	if (!user) return null; // Prevents flash of protected content

	return children;
};

export default ProtectedRoute;
