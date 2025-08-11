import Sidebar from "../components/common/Sidebar";
import TenantsContainer from "../components/containers/TenantsContainer";

const Tenants = () => {
	return (
		<div className="min-h-screen w-full bg-gray-50 dark:bg-neutral-900 flex gap-4">
			<Sidebar />
			<TenantsContainer />
		</div>
	);
};

export default Tenants;
