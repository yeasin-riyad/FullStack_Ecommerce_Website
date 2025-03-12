import { IoMdCloseCircleOutline } from "react-icons/io";

const ViewImage = ({ imgUrl, close }) => {
  return (
    <section className="top-0 left-0 right-0 bottom-0 fixed z-50 bg-neutral-900 flex items-center justify-center">
      <div className="relative flex w-full max-w-md max-h-[80vh] p-4 bg-white rounded-lg shadow-lg">
        {/* Close Button - Positioned at Top Right */}
        <button
          onClick={close}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 transition duration-200"
        >
          <IoMdCloseCircleOutline size={30} />
        </button>

        {/* Image */}
        <img
          className="object-scale-down w-full h-auto"
          src={imgUrl}
          alt="View full screen"
        />
      </div>
    </section>
  );
};

export default ViewImage;
