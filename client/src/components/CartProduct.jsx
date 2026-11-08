import React, { memo, useMemo } from "react";
import { Link } from "react-router-dom";

import { displayPriceInTaka } from "../tools/displayPriceInTaka";
import { validUrlConvert } from "../tools/validUrlConvert";
import { priceAfterDiscount } from "../tools/priceAfterDiscount";

const CartProduct = ({ data }) => {
  const {
    _id,
    name,
    image,
    unit,
    price,
    discount,
    stock,
  } = data;

  // Memoize product URL
  const url = useMemo(
    () => `/product/${validUrlConvert(name)}-${validUrlConvert(_id)}`,
    [name, _id]
  );

  // Calculate discounted price
  const discountedPrice = useMemo(
    () => priceAfterDiscount(price, discount),
    [price, discount]
  );

  const formattedPrice = useMemo(
    () => displayPriceInTaka(discountedPrice),
    [discountedPrice]
  );

  const formattedOriginalPrice = useMemo(
    () => displayPriceInTaka(price),
    [price]
  );

  const hasDiscount = Boolean(discount);
  const isOutOfStock = stock === 0;

  return (
    <Link
      to={url}
      className="lg:min-w-48 border my-1 p-4 flex flex-col gap-x-2 gap-y-1 max-w-52 rounded shadow-lg items-start bg-white hover:shadow-inherit"
    >
      {/* Product Image */}
      <div className="min-h-20 max-h-36 w-full rounded">
        <img
          src={image?.[0]}
          alt={name || "Product"}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-scale-down lg:scale-110 rounded"
        />
      </div>

      {/* Delivery Time */}
      <div className="w-fit bg-green-100 text-green-600 rounded px-2 mt-10 text-sm">
        10 min
      </div>

      {/* Product Information */}
      <div className="font-medium line-clamp-2 p-1 w-full">
        {name}
      </div>

      <div className="w-fit">{unit}</div>

      {/* Product Price */}
      <div className="flex items-center justify-between gap-x-3">
        <div className="font-semibold text-primary-200">
          {formattedPrice}
        </div>
      </div>

      {/* Discount Information */}
      {hasDiscount && (
        <div className="flex items-center gap-x-2">
          <p className="line-through font-extralight text-gray-500">
            ({formattedOriginalPrice})
          </p>

          <p className="font-bold">-{discount}%</p>
        </div>
      )}

      {/* Stock Status */}
      {isOutOfStock && (
        <div className="w-full">
          <span className="text-red-500">Out of Stock</span>
        </div>
      )}
    </Link>
  );
};

export default memo(CartProduct);