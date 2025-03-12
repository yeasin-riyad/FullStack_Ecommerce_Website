import { useNavigate } from "react-router-dom";
import UserMenu from "../components/UserMenu";
import { IoIosCloseCircle } from "react-icons/io";

const UserMenuMobile = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        // if (window.history.length > 1) {
        //     navigate(-1);
        // } else {
        //     navigate("/");
        // }
        navigate('/')
    };

    return (
        <section className="bg-white">
            <div className="p-4 flex justify-end">
                <button onClick={handleBack}>
                    <IoIosCloseCircle className="cursor-pointer text-primary-100 hover:text-primary-200" size={24} />
                </button>
            </div>
            <div className="container p-3 mx-auto">
                <UserMenu />
            </div>
        </section>
    );
};

export default UserMenuMobile;
