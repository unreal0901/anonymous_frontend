import React from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";

import Logo from "../../Assets/android-chrome-192x192.png";
import Breadcrumbs from "./BreadCrumbs";
import { useSelector } from "react-redux";
import { getCurrentBoard } from "../../features/Boards/BoardSlice";
import { getCurrentThread } from "../../features/Threads/ThreadSlice";

const RootLayout = () => {
  const { id, tid } = useParams();
  const boardData = useSelector(getCurrentBoard);
  const threadData = useSelector(getCurrentThread);

  return (
    <>
      <div className="root-layout p-3 overflow-auto">
        <header>
          <nav className="flex  justify-between py-2">
            <NavLink
              to="/"
              className="ml-5 flex items-center gap-2  cursor-pointer"
            >
              <img src={Logo} alt="logo" className="w-7" />
              <span className="text-[1.3rem] font-bold">Leak.it</span>
            </NavLink>
            <div className="flex justify-between gap-4 mr-10">
              <NavLink
                to="/"
                className={({ isActive, isPending }) =>
                  isActive ? "border-b-2 border-[#317FB6]" : ""
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/boards"
                className={({ isActive, isPending }) =>
                  isActive ? "border-b-2 border-[#317FB6]" : ""
                }
              >
                Boards
              </NavLink>
              <NavLink
                to="/popular-threads"
                className={({ isActive, isPending }) =>
                  isActive
                    ? "border-b-2 border-[#317FB6] hidden md:block"
                    : "hidden md:block"
                }
              >
                Popular Threads
              </NavLink>
            </div>
          </nav>
          <Breadcrumbs />
        </header>
        <main>
          <div className="border-b-2 mb-5 flex gap-3">
            {!id && !tid && (
              <div className="">
                <div className="my-5 bg-[#317fb6] w-max p-2 rounded-md text-white ">
                  <h2 className="text-md font-semibold">Boards</h2>
                  <p className="text-sm">Currently opened boards</p>
                </div>
              </div>
            )}

            {id && (
              <div className="">
                <div className="my-5 bg-pink-400 w-max p-2 rounded-md text-white ">
                  <h2 className="text-md font-semibold">{boardData?.name}</h2>
                  <p className="text-sm">Current Board</p>
                </div>
              </div>
            )}

            {tid && (
              <div className="">
                <div className="my-5 bg-purple-400 w-max p-2 rounded-md text-white ">
                  <h2 className="text-md font-semibold">
                    {threadData?.subject}
                  </h2>
                  <p className="text-sm">Current Thread</p>
                </div>
              </div>
            )}
          </div>
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default RootLayout;
