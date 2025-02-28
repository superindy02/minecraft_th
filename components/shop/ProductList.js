import Link from 'next/link';

const ProductList = ({ products }) => {
    if (!products) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map(product => (
                <Link key={product.id} href={`/shop/item/item${product.id}`}>
                    <div className="product-card p-4 border rounded hover:shadow-lg">
                        <h3 className="text-lg font-bold">{product.name}</h3>
                        <p className="text-gray-600">{product.price} บาท</p>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default ProductList; 