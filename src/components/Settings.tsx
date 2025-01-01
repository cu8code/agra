import React from 'react';

const Settings: React.FC = () => {
		return (
				<div className="p-4 text-white">
						<h2 className="text-lg font-bold">Settings</h2>
						<div className="mt-4">
								<label className="block mb-2">
										<span className="text-gray-300">Enable Notifications</span>
										<input type="checkbox" className="ml-2" />
								</label>
								<label className="block mb-2">
										<span className="text-gray-300">Theme</span>
										<select className="ml-2 bg-gray-700 text-white border border-gray-600 rounded">
												<option value="light">Light</option>
												<option value="dark">Dark</option>
										</select>
								</label>
								<label className="block mb-2">
										<span className="text-gray-300">Language</span>
										<select className="ml-2 bg-gray-700 text-white border border-gray-600 rounded">
												<option value="en">English</option>
												<option value="es">Spanish</option>
												<option value="fr">French</option>
										</select>
								</label>
						</div>
				</div>
		);
};

export default Settings;

