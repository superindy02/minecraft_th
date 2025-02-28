import { useState, useEffect } from 'react';
import axios from 'axios';

const ServerStatus = () => {
    const [status, setStatus] = useState({
        online: false,
        players: 0,
        maxPlayers: 0
    });

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await axios.get('/api/server-status');
                setStatus(response.data);
            } catch (error) {
                console.error('Error fetching server status:', error);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 60000); // อัพเดททุก 1 นาที

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-2">สถานะเซิร์ฟเวอร์</h2>
            <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${status.online ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>{status.online ? 'ออนไลน์' : 'ออฟไลน์'}</span>
            </div>
            {status.online && (
                <p className="mt-2">
                    ผู้เล่น: {status.players}/{status.maxPlayers}
                </p>
            )}
        </div>
    );
};

export default ServerStatus;