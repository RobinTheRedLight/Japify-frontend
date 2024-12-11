import { NavLink, Outlet } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import {
  MdAssignmentAdd,
  MdOutlinePostAdd,
  MdEditDocument,
} from "react-icons/md";
import { GrDocumentConfig } from "react-icons/gr";
import { IoBookSharp } from "react-icons/io5";
import { useAppSelector } from "../redux/hook";
import { selectCurrentUser } from "../redux/features/auth/authSlice";
import { User } from "../types/user.type";

const Dashboard = () => {
  const user = useAppSelector(selectCurrentUser) as User | null;

  const closeDrawer = (): void => {
    const drawerCheckbox = document.getElementById(
      "my-drawer-2"
    ) as HTMLInputElement;
    if (drawerCheckbox && drawerCheckbox.checked) {
      drawerCheckbox.checked = false;
    }
  };

  return (
    <div className=" drawer lg:drawer-open bg-[#F2F4F7]">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <Outlet />
        <label
          htmlFor="my-drawer-2"
          className="flex btn btn-outline drawer-button lg:hidden fixed top-0 left-0 right-0"
        >
          Open drawer
        </label>
      </div>
      <div className=" drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-64 min-h-full bg-white text-black">
          {user?.role === "admin" && (
            <>
              <li>
                <NavLink onClick={closeDrawer} to="/dashboard/lessonManage">
                  <GrDocumentConfig /> Manage Lessons
                </NavLink>
              </li>
              <li>
                <NavLink onClick={closeDrawer} to="/dashboard/addLesson">
                  <MdAssignmentAdd /> Add Lesson
                </NavLink>
              </li>
              <li>
                <NavLink onClick={closeDrawer} to="/dashboard/vocabManage">
                  <MdEditDocument /> Manage Vocabularies
                </NavLink>
              </li>
              <li>
                <NavLink onClick={closeDrawer} to="/dashboard/addVocab">
                  <MdOutlinePostAdd />
                  Add Vocabulary
                </NavLink>
              </li>
              <li>
                <NavLink onClick={closeDrawer} to="/dashboard/users">
                  <FaUsers /> Manage Users
                </NavLink>
              </li>
            </>
          )}
          <div className="divider"></div>
          <li>
            <NavLink onClick={closeDrawer} to="/lessons">
              <IoBookSharp /> All Lessons
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
