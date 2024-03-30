import { ProductType } from "@/types/types";
import Image from "next/image";

export const Product = ({ product }: { product: ProductType }) => {
  return (
    <div className="group relative">
      <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
        <Image
          src={product.imageId}
          alt={product.name}
          className="h-full w-full object-cover object-center"
          width={500}
          height={500}
        />
      </div>

      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-500">
            Size {product.size.toUpperCase()}, {product.color}
          </p>
        </div>

        <p className="text-sm font-medium text-gray-900">{product.price}</p>
      </div>
    </div>
  );
};
