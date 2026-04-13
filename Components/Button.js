
import React from "react";
import { twMerge } from "tailwind-merge";
import Link from "next/link";


const Button = ({ href, className, children,...props }) => {
  if (href) {
    return (
      <Link
        className={twMerge(
          "h-12 w-fit min-w-[10rem] px-8 relative mt-4 group flex items-center justify-center gap-x-2 whitespace-nowrap",
          className
        )}
        href={href}
      >
        {React.Children.map(children, (child) => {
          return React.cloneElement(child);
        })}
      </Link>
    );
  }
  return (
    <button
      className={twMerge(
        "h-12 w-fit min-w-[10rem] px-8 relative mt-4 group flex items-center justify-center gap-x-2 whitespace-nowrap",
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        return React.cloneElement(child);
      })}
    </button>
  );
};

const Title = ({ className, children }) => {
  return (
    <p
      className={twMerge(
        "text-sm font-medium text-textColor text-center z-10 group-hover:text-left transition-all duration-300",
        className
      )}
    >
      {children}
    </p>
  );
};

const Icon = ({ className, children }) => {
  return (
    <div
      className={twMerge(
        "hidden z-10  group-hover:block transition-all duration-300 ",
        className
      )}
    >
      {children}
    </div>
  );
};
const Border1 = ({ className }) => {
  return (
    <div
      className={twMerge(
        "w-full h-[80%] border border-accentColor2  group-hover:h-full absolute top-[50%] left-0 transition-all duration-300 -translate-y-[50%]",
        className
      )}
    />
  );
};

const Border2 = ({ className }) => {
  return (
    <div
      className={twMerge(
        "h-full w-[90%] border border-accentColor2 group-hover:w-full absolute top-0  left-[50%] transition-all duration-300 -translate-x-[50%]",
        className
      )}
    />
  );
};

Button.Title = Title;
Button.Icon = Icon;
Button.Border1 = Border1;
Button.Border2 = Border2;

export default Button;
