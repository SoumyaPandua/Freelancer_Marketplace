import React, { useState } from 'react';
import { Title, Text, Button, TextInput } from '@tremor/react';
import {
  BellIcon,
  ShieldCheckIcon,
  UserIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

// Custom Toggle Component
const CustomToggle = ({ value, onChange }) => (
  <label className="flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={value}
      onChange={() => onChange(!value)}
      className="sr-only"
    />
    <div
      className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
        value ? 'bg-blue-500' : 'bg-gray-300'
      }`}
    >
      <div
        className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transform transition-all duration-300 ${
          value ? 'translate-x-5' : 'translate-x-1'
        }`}
      ></div>
    </div>
  </label>
);

const AdminSettings = () => {
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="p-6 space-y-10 min-h-screen">
      <Title className="text-4xl font-bold text-gray-800 text-center mb-8">
        Admin Settings
      </Title>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {/* Profile Settings */}
        <div className="group relative bg-white rounded-2xl p-6 shadow-lg transform transition hover:-translate-y-2 hover:shadow-2xl hover:scale-105 duration-300 border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <UserIcon className="h-8 w-8 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Profile Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Text className="mb-2 font-medium">Email Address</Text>
              <TextInput placeholder="your@email.com" className="w-full" />
            </div>
            <div>
              <Text className="mb-2 font-medium">Username</Text>
              <TextInput placeholder="username" className="w-full" />
            </div>
            <Button
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all hover:scale-105 duration-300"
            >
              Update Profile
            </Button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="group relative bg-white rounded-2xl p-6 shadow-lg transform transition hover:-translate-y-2 hover:shadow-2xl hover:scale-105 duration-300 border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <BellIcon className="h-8 w-8 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-800">Notification Preferences</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Text className="font-medium text-gray-700">Push Notifications</Text>
                <Text className="text-gray-500">Receive push notifications</Text>
              </div>
              <CustomToggle value={notifications} onChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Text className="font-medium text-gray-700">Email Updates</Text>
                <Text className="text-gray-500">Receive email updates</Text>
              </div>
              <CustomToggle value={emailUpdates} onChange={setEmailUpdates} />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="group relative bg-white rounded-2xl p-6 shadow-lg transform transition hover:-translate-y-2 hover:shadow-2xl hover:scale-105 duration-300 border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <ShieldCheckIcon className="h-8 w-8 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-800">Security Settings</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Text className="font-medium text-gray-700">Two-Factor Authentication</Text>
                <Text className="text-gray-500">Enable 2FA for added security</Text>
              </div>
              <CustomToggle value={twoFactor} onChange={setTwoFactor} />
            </div>
            <Button
              className="w-full mt-4 bg-gray-200 hover:bg-gray-300 font-semibold py-2 rounded-lg transition-all hover:scale-105 duration-300"
            >
              Change Password
            </Button>
          </div>
        </div>

        {/* Regional Settings */}
        <div className="group relative bg-white rounded-2xl p-6 shadow-lg transform transition hover:-translate-y-2 hover:shadow-2xl hover:scale-105 duration-300 border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <GlobeAltIcon className="h-8 w-8 text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-800">Regional Settings</h2>
          </div>
          <div className="space-y-6">
            <div>
              <Text className="mb-2 font-medium">Time Zone</Text>
              <select className="w-full p-2 border rounded-lg shadow-sm">
                <option>UTC (GMT+0)</option>
                <option>EST (GMT-5)</option>
                <option>PST (GMT-8)</option>
              </select>
            </div>
            <div>
              <Text className="mb-2 font-medium">Language</Text>
              <select className="w-full p-2 border rounded-lg shadow-sm">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="relative bg-white border border-red-300 rounded-2xl p-6 shadow-lg transform transition hover:-translate-y-2 hover:shadow-2xl hover:scale-105 duration-300">
        <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
        <Text className="text-gray-700 mt-2">
          Once you delete your account, there is no going back. Please be certain.
        </Text>
        <Button
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-all hover:scale-105 duration-300"
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;