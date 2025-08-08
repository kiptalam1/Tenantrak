import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	// Fetch user on mount and when auth state changes
	useEffect(() => {
		const fetchUser = async () => {
			try {
				setLoading(true);
				const res = await fetch("/api/users/me", {
					credentials: "include", // Necessary for cookies
				});

				if (!res.ok) {
					if (res.status === 401) {
						// JWT expired or invalid
						clearAuth();
					}
					throw new Error("Not authenticated");
				}

				const data = await res.json();
				setUser(data.user);
			} catch (err) {
				console.error("Auth error:", err.message);
				clearAuth();
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	const clearAuth = () => {
		setUser(null);
	};

	const login = async (credentials) => {
		try {
			setLoading(true);
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include", // Required to receive cookies
				body: JSON.stringify(credentials),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData?.message || "Login failed");
			}

			const data = await res.json();
			setUser(data.user);
			toast.success("Login successful");
			navigate("/dashboard");
		} catch (err) {
			toast.error(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		try {
			await fetch("/api/auth/logout", {
				method: "POST",
				credentials: "include", // Required to clear cookies
			});
		} finally {
			clearAuth();
			toast.success("Logged out");
			navigate("/login");
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				login,
				logout,
				isAuthenticated: !!user,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
