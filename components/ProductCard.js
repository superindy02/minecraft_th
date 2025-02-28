export default function ProductCard({ product, onAddToCart, isLoggedIn }) {
    return (
      <div className="border rounded-lg overflow-hidden shadow-lg">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
          <p className="text-gray-600 mb-2">{product.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">{product.price} บาท</span>
            <button
              onClick={() => onAddToCart(product)}
              disabled={!isLoggedIn}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              เพิ่มลงตะกร้า
            </button>
          </div>
        </div>
      </div>
    );
  }