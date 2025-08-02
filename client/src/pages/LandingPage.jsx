import React from "react";
import LoginForm from "../components/landing/LoginForm";

const LandingPage = () => {
	return (
		<div className="min-h-screen w-full flex flex-col sm:flex-row items-center justify-center gap-6 bg-gray-50 dark:bg-neutral-900 px-4 sm:px-6">
			<div className="max-w-md text-center sm:text-left">
				<h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-500 mb-3">
					Tenantrak
				</h1>
				<p className="italic text-gray-600 dark:text-gray-400">
					Track tenants, leases, payments,
					<br /> and maintenance — all in one streamlined <br /> platform.
				</p>
			</div>
			<LoginForm />
		</div>
	);
};

export default LandingPage;
