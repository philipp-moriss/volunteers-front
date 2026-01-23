import {FC} from "react";
import * as React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container:FC<ContainerProps> = ({children, className=""}) => {
  return (
    <section
      className={`flex flex-col items-center px-5 pt-20 ${className}`}
    >
      {children}
    </section>
  )
}