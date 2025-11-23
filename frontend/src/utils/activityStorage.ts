// Utility functions for managing user activity in localStorage

export interface Activity {
	id: string;
	type: "comment" | "like" | "view";
	content: string;
	etf?: string;
	timestamp: number;
}

export const saveActivity = (activity: Omit<Activity, "id" | "timestamp">) => {
	const activities = getActivities();
	const newActivity: Activity = {
		...activity,
		id: Date.now().toString(),
		timestamp: Date.now(),
	};

	// Add new activity at the beginning
	const updatedActivities = [newActivity, ...activities];

	// Keep only the most recent 50 activities
	const limitedActivities = updatedActivities.slice(0, 50);

	localStorage.setItem("recentActivities", JSON.stringify(limitedActivities));

	return newActivity;
};

export const getActivities = (): Activity[] => {
	const saved = localStorage.getItem("recentActivities");
	return saved ? JSON.parse(saved) : [];
};

export const clearActivities = () => {
	localStorage.removeItem("recentActivities");
};
