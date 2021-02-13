import React from "react";

interface IConditonalWrapperProps {
  children: React.ReactElement;
  condition: boolean;
  wrapper: (children: React.ReactElement) => JSX.Element;
}

export const ConditonalWrapper: React.FC<IConditonalWrapperProps> = (props) =>
  props.condition ? props.wrapper(props.children) : props.children;
