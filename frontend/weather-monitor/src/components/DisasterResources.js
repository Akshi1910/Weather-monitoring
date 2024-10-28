import React, { useEffect, useState } from 'react';

const DisasterResources = ({ disasterId }) => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await fetch(`/disasters/${disasterId}/resources`);
                if (!response.ok) {
                    throw new Error('Failed to fetch resources');
                }
                const data = await response.json();
                setResources(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, [disasterId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <ul>
            {resources.map(resource => (
                <li key={resource._id}>
                    {resource.name} - {resource.description}
                </li>
            ))}
        </ul>
    );
};

export default DisasterResources;
