import { ProductDTO } from "@services/products";
import { formatPrice } from "@utils/price";

import { MdAdd, MdShoppingBag } from "react-icons/md";

interface ProductProps {
  products: ProductDTO[];
}

export default function Product({ products }: ProductProps) {
  return (
    <section>
      <div className="flex flex-col">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex gap-2 py-3 last:border-none border-b border-primary-200"
          >
            <div className="w-1/4 bg-primary-300 rounded-xl aspect-square" />
            <div className="flex flex-col justify-between flex-1 font-medium text-sm gap-2">
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex text-xxs font-semibold justify-between">
                  <div className="flex gap-2">
                    <span className="rounded-full flex items-center justify-center bg-primary-300 text-white py-1 px-2">
                      {product.category}
                    </span>
                  </div>
                  <button className="flex items-center text-primary-300 bg-primary-200 rounded-full p-1">
                    <MdShoppingBag size={20} />
                    <MdAdd size={20} />
                  </button>
                </div>
                <p className="line-clamp-2">{product.name}</p>
              </div>
              <p className="text-primary-300">{formatPrice(product.price)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
