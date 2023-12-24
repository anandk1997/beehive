// import Logo from "src/images/logo/logo-icon.svg";
import { useLocation } from "react-router-dom";
import DarkModeSwitcher from "./DarkModeSwitcher";
// import DropdownMessage from "./DropdownMessage";
import DropdownNotification from "./DropdownNotification";
// import DropdownUser from "./DropdownUser";
import { SearchIcon } from "src/assets/Svg";
import { searchedValue, onChange, page, search } from "src/Signals/WalkList";

const Header = ({
  setSidebarOpen,
  sidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between p-2 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                {menubar("0", "300", sidebarOpen)}
                {menubar("150", "400", sidebarOpen)}
                {menubar("200", "500", sidebarOpen)}
              </span>

              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && "!h-0 !delay-[0]"
                  }`}
                />
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && "!h-0 !delay-200"
                  }`}
                />
              </span>
            </span>
          </button>

          {/* <Link className="block flex-shrink-0 lg:hidden" to="/">
            <img src={Logo} alt="Logo" />
          </Link> */}
        </div>

        {pathname === "/" && (
          <div className="">
            <div className="relative ml-3">
              <button
                className="absolute top-1/2 left-0 -translate-y-1/2"
                onClick={() => (
                  (searchedValue.value = search.value), (page.value = 1)
                )}
              >
                <SearchIcon />
              </button>

              <input
                type="text"
                placeholder="Type to search..."
                className="w-full bg-transparent pr-4 pl-9 focus:outline-none"
                value={search.value}
                onChange={onChange}
                onKeyDown={onChange}
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 2xsm:gap-7 ml-auto">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <DarkModeSwitcher />
            <DropdownNotification />
            {/* <DropdownMessage /> */}
          </ul>

          {/* <DropdownUser /> */}
        </div>
      </div>
    </header>
  );
};

export default Header;

const menubar = (d1: string, d2: string, sidebarOpen: boolean) => (
  <span
    className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[${d1}] duration-200 ease-in-out dark:bg-white ${
      !sidebarOpen && `!w-full delay-${d2}`
    }`}
  />
);
