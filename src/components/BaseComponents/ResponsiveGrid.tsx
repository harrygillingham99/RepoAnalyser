import Masonry from "react-masonry-css";
import "@styles/Masonry.scss";
import { PropsWithChildren } from "react";

interface IResponsiveGridProps<T> {
  items?: T[];
  mapFunc?: (item: T) => JSX.Element;
}
/* Will accept children for the grid OR a list of items with a mapper function  */
export function ResponsiveGrid<T>(
  props: PropsWithChildren<IResponsiveGridProps<T>>
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
      {props.children ?? props!.items!.map((item) => props!.mapFunc!(item))}
    </Masonry>
  );
}
