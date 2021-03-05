import React from "react";

interface IConditionalWrapperProps {
  condition: boolean;
  wrapper: (children: React.ReactNode) => JSX.Element;
}

export const WrapChildrenIf: React.FC<IConditionalWrapperProps> = (
  props
): JSX.Element =>
  props.condition ? props.wrapper(props.children) : <>{props.children}</>;
