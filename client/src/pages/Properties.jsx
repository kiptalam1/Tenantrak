import React from "react";
import Sidebar from "../components/common/Sidebar";
import PropertiesContainer from "../components/containers/PropertiesContainer";

const Properties = () => {
	return (
		<div className="min-h-screen w-full bg-gray-50 dark:bg-neutral-900 flex gap-4">
			<Sidebar />
			<PropertiesContainer />
		</div>
	);
};

export default Properties;
