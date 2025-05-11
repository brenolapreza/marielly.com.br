import type { PropsWithChildren } from "react";

export const Button: React.FC<PropsWithChildren> = ({ children, ...rest }) => {
  return (
    <button
      {...rest}
      className="bg-tertiary cursor-pointer text-white font-bold uppercase py-2 px-8 rounded hover:transform-3d"
    >
      {children}
    </button>
  );
};
