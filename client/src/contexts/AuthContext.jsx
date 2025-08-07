import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetch("/api/users/me"); // Your endpoint to get current user
				if (!res.ok) throw new Error("Not authenticated");
				const data = await res.json();
				setUser(data.user);
			} catch (err) {
				console.error("Error in AuthContext ", err.message);
				setUser(null);
			} finally {
				setLoading(false);
			}
		};
		fetchUser();
	}, []);

	const login = async (credentials) => {
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include", // Include cookies if using httpOnly auth
				body: JSON.stringify(credentials),
			});

			const data = await res.json();
			// console.log("login data", data.error);

			if (!res.ok) {
				// toast.error(data.error || "Login failed");
				throw new Error(data?.error || "Login failed");
			}

			setUser(data.user);
			toast.success(data.message);
			setTimeout(() => {
				navigate("/dashboard");
			}, 1000);
			return data.user;
		} catch (err) {
			toast.error(err.message || "Something went wrong");
			setTimeout(() => {
				navigate("/");
			}, 2000);
		}
	};

	const logout = async () => {
		const res = await fetch("/api/auth/logout", { method: "POST" });
		const data = await res.json();
		setUser(null);
		toast.success(data?.message);
		setTimeout(() => {
			navigate("/");
		}, 2000);
	};

	return (
		<AuthContext.Provider value={{ user, loading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
