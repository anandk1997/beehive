import { DarkModeIcon, LightModeIcon } from "src/assets/Svg";
import useColorMode from "src/hooks/useColorMode";

const DarkModeSwitcher = () => {
  const [colorMode, setColorMode] = useColorMode();

  return (
    <li>
      <label
        className={`relative m-0 block h-6 w-12 rounded-full ${
          colorMode === "dark" ? "bg-bodydark" : "bg-stroke"
        }`}
      >
        <input
          type="checkbox"
          onChange={() => {
            if (typeof setColorMode === "function") {
              setColorMode(colorMode === "light" ? "dark" : "light");
            }
          }}
          className="dur absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
        />
        <span
          className={`absolute top-1/2 left-[4px] flex h-5 w-5 -translate-y-1/2 translate-x-0 items-center justify-center rounded-full bg-white shadow-switcher duration-200 ease-linear ${
            colorMode === "dark" && "!right-[3px] !translate-x-full"
          }`}
        >
          {colorMode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
        </span>
      </label>
    </li>
  );
};

export default DarkModeSwitcher;
