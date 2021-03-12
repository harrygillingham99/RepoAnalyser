import Masonry from "react-masonry-css";
import "@styles/Masonry.scss";
import * as React from "react";

type ResponsiveGridItemMapper<T> = {
  items: T[];
  mapToElemFunc: (item: T) => JSX.Element;
};

interface IResponsiveGridProps<T> {
  gridBuilder?: ResponsiveGridItemMapper<T>;
}
/* Will accept children for the grid OR a list of items with a mapper function  */
export function ResponsiveGrid<T>(
  props: React.PropsWithChildren<IResponsiveGridProps<T>>
) {
  return (
    <Masonry
      breakpointCols={{
        default: 5,
        1300: 4,
        1100: 3,
        700: 2,
        500: 1,
      }}
      className="masonry-grid mt-1"
      columnClassName="masonry-grid_column"
    >
      {props.gridBuilder !== undefined
        ? props.gridBuilder.items.map((item) =>
            props.gridBuilder!.mapToElemFunc(item)
          )
        : props.children}
    </Masonry>
  );
}
