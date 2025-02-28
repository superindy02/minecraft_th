import Layout from '../../../components/Layout';
import { useAuth } from '../../../hooks/useAuth';
import useCart from '../../../hooks/useCart';

export default function Item1() {
    const { user } = useAuth();
    const { addItem } = useCart();

    const item = {
        id: 1,
        name: "VIP Rank",
        price: 199,
        description: "รับสิทธิพิเศษมากมายด้วย VIP Rank!",
        benefits: [
            "พื้นที่สร้างบ้านเพิ่มขึ้น",
            "คำสั่งพิเศษ /fly",
            "ช่องเก็บของพิเศษ",
            "ป้ายชื่อ VIP"
        ]
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-4xl font-bold mb-4">{item.name}</h1>
                    <p className="text-2xl text-green-600 mb-4">{item.price} บาท</p>
                    <div className="prose max-w-none mb-6">
                        <p>{item.description}</p>
                        <h3>สิทธิประโยชน์:</h3>
                        <ul>
                            {item.benefits.map((benefit, index) => (
                                <li key={index}>{benefit}</li>
                            ))}
                        </ul>
                    </div>
                    <button 
                        onClick={() => addItem(item)}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                    >
                        เพิ่มลงตะกร้า
                    </button>
                </div>
            </div>
        </Layout>
    );
} 