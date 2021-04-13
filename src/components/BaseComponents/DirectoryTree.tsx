import { FormControl, InputGroup, ListGroup } from "react-bootstrap";
import TreeMenu from "react-simple-tree-menu";

interface ITreeData {
  nodes: ITreeData[];
  key: string;
  label: string;
}
interface IDirTreeProps {
  dirs: string[][];
  repoName: string;
  setSelectedItem: (file: string) => void;
}
const DEFAULT_PADDING = 16;
const ICON_SIZE = 8;
const LEVEL_SPACE = 16;

const ToggleIcon = (props: { on: boolean }) => (
  <span style={{ marginRight: 8 }}>{props.on ? "-" : "+"}</span>
);

export const DirectoryTree = (props: IDirTreeProps) => {
  const { setSelectedItem } = props;
  const arrangeIntoTree = (paths: string[][]) => {
    let tree: ITreeData[] = new Array<ITreeData>();
    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      let currentLevel = tree;
      for (let j = 0; j < path.length; j++) {
        const part = path[j];
        const existingPath = currentLevel.find((x) => x.label === part);

        if (existingPath) {
          currentLevel = existingPath.nodes;
        } else {
          var newPart = {
            nodes: [],
            key: `${part}-listItem`,
            label: part,
          };

          currentLevel.push(newPart);
          currentLevel = newPart.nodes;
        }
      }
    }

    tree[0].label = props.repoName;
    tree[0].key = `${props.repoName}-listItem`;
    tree[0].nodes = tree[0].nodes.sort(
      (a, b) => b.nodes.length - a.nodes.length
    );
    return tree;
  };

  const ListItem = ({
    level = 0,
    hasNodes,
    isOpen,
    label,
    searchTerm,
    openNodes,
    toggleNode,
    matchSearch,
    focused,
    ...props
  }: any) => (
    <ListGroup.Item
      {...props}
      onClick={(e) => {
        hasNodes && toggleNode && toggleNode();
        setSelectedItem(label);
        e.stopPropagation();
      }}
      style={{
        paddingLeft: DEFAULT_PADDING + ICON_SIZE + level * LEVEL_SPACE,
        cursor: "pointer",
        boxShadow: focused ? "0px 0px 5px 0px #222" : "none",
        zIndex: focused ? 999 : "unset",
        position: "relative",
      }}
    >
      {hasNodes && <ToggleIcon on={isOpen} />}
      {label}
    </ListGroup.Item>
  );

  return (
    <TreeMenu data={arrangeIntoTree(props.dirs)} debounceTime={500}>
      {({ search, items }) => (
        <>
          <InputGroup size="sm" className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroup-sizing-sm">
                Search
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              aria-label="Small"
              aria-describedby="inputGroup-sizing-sm"
              onChange={(ev) => search!(ev.target.value)}
            />
          </InputGroup>
          <ListGroup>
            {items.map((props) => (
              <ListItem {...props} />
            ))}
          </ListGroup>
        </>
      )}
    </TreeMenu>
  );
};
