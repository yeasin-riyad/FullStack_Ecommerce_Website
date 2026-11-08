
import  { memo } from "react";

const Skeleton = ({ className = "" }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded-lg ${className}`}
  />
);

const ProductDetailsSkeleton = () => {
  return (
    <section className="container mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Product Images Skeleton */}
      <div>
        {/* Main Image */}
        <Skeleton className="w-full h-[30vh] lg:h-[55vh] rounded-xl" />

        {/* Image Indicators */}
        <div className="flex justify-center gap-2 py-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="w-3 h-3 lg:w-5 lg:h-5 rounded-full"
            />
          ))}
        </div>

        {/* Thumbnail Images */}
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="w-20 h-20 flex-shrink-0 rounded-md"
            />
          ))}
        </div>

        {/* Desktop Product Information */}
        <div className="hidden lg:block space-y-4 mt-6">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-5 w-32 mt-5" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>

      {/* Product Information Skeleton */}
      <div className="p-2 lg:pl-7 space-y-5">

        {/* Delivery Time */}
        <Skeleton className="h-7 w-20 rounded-full" />

        {/* Product Name */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-4/5" />
          <Skeleton className="h-4 w-28" />
        </div>

        <Skeleton className="h-px w-full" />

        {/* Price */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-12 w-28" />
          <Skeleton className="h-5 w-16" />
        </div>

        {/* Quantity */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-12 w-32" />
        </div>

        {/* Add to Cart */}
        <Skeleton className="h-11 w-36 rounded-lg" />

        {/* Mobile Product Information */}
        <div className="lg:hidden space-y-4 pt-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-5 w-32 mt-5" />
          <Skeleton className="h-4 w-full" />
        </div>

        {/* Shopping Benefits */}
        <div className="space-y-5 pt-4">
          <Skeleton className="h-6 w-48" />

          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex gap-4 items-center">
              <Skeleton className="w-20 h-20 flex-shrink-0" />

              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default memo(ProductDetailsSkeleton);
