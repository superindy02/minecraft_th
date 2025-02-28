import { useCart } from '../../hooks/useCart';

const ShoppingCart = () => {
    const { items, removeItem, clearCart } = useCart();

    const total = items.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">ตะกร้าสินค้า</h2>
            {items.length === 0 ? (
                <p>ไม่มีสินค้าในตะกร้า</p>
            ) : (
                <>
                    {items.map(item => (
                        <div key={item.id} className="flex justify-between items-center mb-2">
                            <span>{item.name}</span>
                            <span>{item.price} บาท</span>
                            <button 
                                onClick={() => removeItem(item.id)}
                                className="text-red-500"
                            >
                                ลบ
                            </button>
                        </div>
                    ))}
                    <div className="border-t mt-4 pt-4">
                        <div className="flex justify-between font-bold">
                            <span>รวม</span>
                            <span>{total} บาท</span>
                        </div>
                        <button 
                            onClick={clearCart}
                            className="w-full mt-4 bg-red-500 text-white py-2 rounded"
                        >
                            ล้างตะกร้า
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ShoppingCart; 