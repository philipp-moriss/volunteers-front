import {FC} from "react";
import * as React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container:FC<ContainerProps> = ({children, className=""}) => {
  return (
    <section
      className={`min-h-screen flex flex-col items-center px-5 pt-20 pb-12 ${className}`}
    >
      {children}
    </section>
  )
}