import { MinecraftServerUtil } from '../../utils/minecraft';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const serverStatus = await MinecraftServerUtil.status('43.229.148.199', 25565);
    res.status(200).json({ success: true, ...serverStatus });
  } catch (error) {
    console.error('Server Status Error:', error);
    res.status(503).json({ error: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้' });
  }
}