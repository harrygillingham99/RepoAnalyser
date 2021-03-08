import Masonry from "react-masonry-css";
import "@styles/Masonry.scss";

interface IResponsiveGridProps<T> {
  items: T[];
  mapFunc: (item: T) => JSX.Element;
}
export function ResponsiveGrid<T>(props: IResponsiveGridProps<T>) {
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
      {props.items.map((item) => props.mapFunc(item))}
    </Masonry>
  );
}
