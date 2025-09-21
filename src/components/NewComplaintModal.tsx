import React, { useState } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';

interface NewComplaintModalProps {
    onClose: () => void;
    onCreate: (text: string, location: { lat: number; lng: number } | null) => Promise<void>;
}

export const NewComplaintModal: React.FC<NewComplaintModalProps> = ({ onClose, onCreate }) => {
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [locationError, setLocationError] = useState('');

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            setLocationStatus('error');
            setLocationError('Geolocation is not supported by your browser.');
            return;
        }

        setLocationStatus('loading');
        setLocationError('');
        setLocation(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocationStatus('success');
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            () => {
                setLocationStatus('error');
                setLocationError('Unable to retrieve your location. Please check your browser permissions.');
            }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        setIsSubmitting(true);
        try {
            await onCreate(text, location);
        } catch (error) {
            console.error("Failed to create complaint:", error);
            // Optionally, show an error message to the user here
        } finally {
            // Ensure the button is re-enabled even if creation fails,
            // as the modal stays open in that case.
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Complaint</h3>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <div>
                            <label htmlFor="complaint-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Complaint Details
                            </label>
                            <textarea
                                id="complaint-text"
                                rows={6}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Enter the full text of the complaint..."
                                required
                            />
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                After creation, the complaint will be automatically classified by AI.
                            </p>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Attach Location (Optional)
                            </label>
                            <div className="mt-1 flex items-center space-x-3">
                                <button
                                    type="button"
                                    onClick={handleGetLocation}
                                    disabled={locationStatus === 'loading'}
                                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50"
                                >
                                    <MapPinIcon className="w-5 h-5 mr-2" />
                                    {locationStatus === 'loading' ? 'Fetching...' : 'Get Current Location'}
                                </button>
                                {locationStatus === 'success' && location && (
                                    <p className="text-sm text-green-600 dark:text-green-400">Location captured!</p>
                                )}
                            </div>
                             {locationStatus === 'error' && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{locationError}</p>
                             )}
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 flex justify-end space-x-3 rounded-b-lg">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !text.trim()}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                        >
                            {isSubmitting ? 'Creating & Classifying...' : 'Create Complaint'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};