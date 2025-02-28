import net from 'net';

export class MinecraftServerUtil {
    static async status(host, port = 25565) {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();
            let data = Buffer.alloc(0);

            client.connect(port, host, () => {
                // ส่ง handshake packet
                const handshake = Buffer.from([
                    0x00, // Packet ID
                    0x00, // Protocol Version
                    host.length, // Host length
                    ...Buffer.from(host), // Host
                    (port >> 8) & 0xFF, // Port (high byte)
                    port & 0xFF, // Port (low byte)
                    0x01 // Next state (1 for status)
                ]);

                client.write(handshake);
                client.write(Buffer.from([0x00])); // Status request
            });

            client.on('data', chunk => {
                data = Buffer.concat([data, chunk]);
                try {
                    const response = JSON.parse(data.toString('utf8'));
                    client.destroy();
                    resolve({
                        online: true,
                        players: {
                            online: response.players?.online || 0,
                            max: response.players?.max || 0,
                            list: response.players?.sample || []
                        },
                        version: response.version?.name || 'Unknown',
                        description: response.description?.text || 'A Minecraft Server'
                    });
                } catch (e) {
                    // ยังรับข้อมูลไม่ครบ รอข้อมูลเพิ่มเติม
                }
            });

            client.on('error', error => {
                client.destroy();
                resolve({
                    online: false,
                    error: error.message
                });
            });

            // timeout หลังจาก 5 วินาที
            setTimeout(() => {
                client.destroy();
                resolve({
                    online: false,
                    error: 'Connection timeout'
                });
            }, 5000);
        });
    }
}