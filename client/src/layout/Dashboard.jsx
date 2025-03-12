import { Outlet } from "react-router-dom";
import UserMenu from "../components/UserMenu";

const Dashboard = () => {
  return (
    <section className="bg-white min-h-screen">
      <div className="container mx-auto p-3 grid lg:grid-cols-[250px,1fr]">
        {/* left for menu */}
        <div className=" sticky top-24 min-h-[calc(100vh-96px)] self-start hidden border-r-2 shadow-md px-3 lg:block">
          <UserMenu/>
        </div>

        {/* right for content */}
        <div className=" min-h-screen ">
          <Outlet />
        </div>

       

      </div>
    </section>
  )
}

export default Dashboard
