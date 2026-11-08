import { memo, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import banner from "../assets/banner.jpg";
import mobileBanner from "../assets/banner-mobile.jpg";
import { validUrlConvert } from "../tools/validUrlConvert";
import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay";

const SKELETON_ITEMS = Array.from({ length: 20 }, (_, index) => index);

const CategorySkeleton = memo(() => (
  <div className="bg-white p-4 grid gap-2 shadow min-h-32 animate-pulse">
    <div className="bg-blue-100 min-h-24 rounded" />
    <div className="bg-blue-100 h-8 rounded" />
  </div>
));
CategorySkeleton.displayName = "CategorySkeleton";

const Home = () => {
  const loadingCategory = useSelector(
    (state) => state.products.loadingCategories,
  );

  const categories = useSelector((state) => state.products.categories);

  const subCategories = useSelector((state) => state.products.subCategories);

  const navigate = useNavigate();

  // Prevent unnecessary recalculation when dependencies are unchanged
  const categoryList = useMemo(() => categories ?? [], [categories]);

  // Optimize navigation handler
  const handleRedirectProductListPage = useCallback(
    (id, catName) => {
      const subCategory = subCategories?.find((subC) =>
        subC?.category?.some((category) => category._id === id),
      );

      if (!subCategory) return;

      const url = `/${validUrlConvert(catName)}-${id}/${validUrlConvert(
        subCategory.name,
      )}-${subCategory._id}`;

      navigate(url);
    },
    [subCategories, navigate],
  );

  return (
    <section className="mx-auto container bg-white">
      {/* Banner */}
      <div className="container mx-auto">
        <picture>
          <source media="(min-width: 1024px)" srcSet={banner} />
          <img
            src={mobileBanner}
            alt="Shop banner"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover rounded"
          />
        </picture>
      </div>

      {/* Categories */}
      <div className="px-6 my-2 grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-3">
        {loadingCategory
          ? SKELETON_ITEMS.map((index) => <CategorySkeleton key={index} />)
          : categoryList.map((cat) => (
              <div
                key={cat._id}
                onClick={() => handleRedirectProductListPage(cat._id, cat.name)}
                className="cursor-pointer"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-scale-down"
                />
              </div>
            ))}
      </div>

      {/* Category-wise Products */}
      {categoryList.map((cat) => (
        <CategoryWiseProductDisplay
          key={cat._id}
          id={cat._id}
          name={cat.name}
        />
      ))}
    </section>
  );
};

export default memo(Home);
