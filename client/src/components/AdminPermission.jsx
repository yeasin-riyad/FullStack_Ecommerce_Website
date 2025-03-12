import { useSelector } from "react-redux";
import { checkUserRole } from "../tools/checkUserRole";
import ErrorPage from "../pages/ErrorPage";
import Loading from "./Loading";

const AdminPermission = ({children}) => {
    const user = useSelector((state) => state?.user);
      const isAdmin = checkUserRole(user?.role);
    
      if (!user?.email) {
        return <Loading />;
    }

  return (
    <div>
        {isAdmin ? <>{children}</> :<ErrorPage/>}
      
    </div>
  )
}

export default AdminPermission
