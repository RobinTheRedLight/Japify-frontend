import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Login from "../Pages/Login/Login";
import SignUp from "../Pages/SignUp/SignUp";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../Layout/Dashboard";
import AdminRoute from "./AdminRoute";
import ManageLessons from "../Pages/Dashboard/ManageLessons/ManageLessons";
import AddLesson from "../Pages/Dashboard/AddLesson/AddLesson";
import ManageVocab from "../Pages/Dashboard/ManageVocab/ManageVocab";
import AddVocab from "../Pages/Dashboard/AddVocab/AddVocab";
import ManageUsers from "../Pages/Dashboard/ManageUsers/ManageUsers";
import Lessons from "../Pages/Lessons/Lessons";
import Lesson from "../Pages/Lesson/Lesson";
import Tutorial from "../Pages/Tutorial/Tutorial";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        {" "}
        <Main></Main>{" "}
      </PrivateRoute>
    ),
    children: [
      {
        path: "/",
        element: <Lessons></Lessons>,
      },
      {
        path: "/lessons",
        element: <Lessons></Lessons>,
      },
      {
        path: "/lessons/:id",
        element: <Lesson></Lesson>,
      },
      {
        path: "/tutorials",
        element: <Tutorial></Tutorial>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <AdminRoute>
        <Dashboard></Dashboard>
      </AdminRoute>
    ),
    children: [
      {
        path: "lessonManage",
        element: <ManageLessons></ManageLessons>,
      },
      {
        path: "addLesson",
        element: <AddLesson></AddLesson>,
      },
      {
        path: "lessonManage",
        element: <ManageLessons></ManageLessons>,
      },
      {
        path: "vocabManage",
        element: <ManageVocab></ManageVocab>,
      },
      {
        path: "addVocab",
        element: <AddVocab></AddVocab>,
      },
      {
        path: "users",
        element: <ManageUsers></ManageUsers>,
      },
    ],
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "/signup",
    element: <SignUp></SignUp>,
  },
]);
