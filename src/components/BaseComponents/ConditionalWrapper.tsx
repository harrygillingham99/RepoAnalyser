import React from "react";

interface IConditionalWrapperProps {
  children: React.ReactElement;
  condition: boolean;
  wrapper: (children: React.ReactElement) => JSX.Element;
}

export const ConditonalWrapper: React.FC<IConditionalWrapperProps> = (props) =>
  props.condition ? props.wrapper(props.children) : props.children;
