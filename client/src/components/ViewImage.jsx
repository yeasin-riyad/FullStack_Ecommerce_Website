
import { memo, useCallback, useEffect } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";

const ViewImage = ({ imgUrl, close }) => {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        close();
      }
    },
    [close]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <section
      className="fixed inset-0 z-50 bg-neutral-900/80 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      onClick={close}
    >
      <div
        className="relative flex w-full max-w-md max-h-[80vh] p-4 bg-white rounded-lg shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={close}
          aria-label="Close image preview"
          className="absolute top-2 right-2 z-10 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <IoMdCloseCircleOutline size={30} />
        </button>

        {/* Preview Image */}
        <img
          src={imgUrl}
          alt="Product full preview"
          className="object-contain w-full max-h-[70vh]"
          loading="eager"
          draggable="false"
        />
      </div>
    </section>
  );
};

export default memo(ViewImage);
