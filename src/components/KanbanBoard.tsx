import React, { CSSProperties, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableLocation,
  NotDraggingStyle,
  DraggingStyle,
} from "react-beautiful-dnd";
import { Button, Card } from "react-bootstrap";

type BoardCard = { id: string; content: string };

type Board = BoardCard[][];

const grid = 8;

const background = "lightgrey";

// fake data generator
const getItems = (count: number, offset = 0): BoardCard[] =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `item ${k + offset}`,
  }));

function reorder<T>(
  list: Array<T>,
  startIndex: number,
  endIndex: number
): Array<T> {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

/**
 * Moves an item from one list to another list.
 */
function move<T>(
  source: Array<T>,
  destination: Array<T>,
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
) {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const sInd = droppableSource.droppableId;
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result: { [key: string]: Array<T> } = {};
  result[sInd] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
}

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined
): CSSProperties => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : background,

  // styles we need to apply on draggables
  ...draggableStyle,
});
const getListStyle = (isDraggingOver: boolean): CSSProperties => ({
  background: isDraggingOver ? "lightblue" : background,
  padding: grid,
  width: 250,
});

export const KanbanBoard = () => {
  const [state, setState] = useState<Board>([
    getItems(5),
    getItems(5, 10),
    getItems(5, 15),
    getItems(5, 20),
  ]);
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];
      setState(newState.filter((group) => group.length));
    }
  };

  return (
    <div>
      <Button
        type="button"
        variant="info"
        className="m-1"
        onClick={() => {
          setState([...state, []]);
        }}
      >
        Add new group
      </Button>
      <Button
        type="button"
        variant="info"
        className="m-1"
        onClick={() => {
          setState([...state, getItems(1)]);
        }}
      >
        Add new item
      </Button>
      <div style={{ display: "flex" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {state.map((el, ind) => (
            <Droppable key={ind} droppableId={`${ind}`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  {el.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => {
                        const itemStyles = getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        );
                        return (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="border border-info rounded p-2"
                            style={itemStyles}
                          >
                            <Card
                              style={{
                                display: "flex",
                                justifyContent: "space-around",
                                background: itemStyles.background,
                                border: "none",
                              }}
                            >
                              <Card.Title>{item.content}</Card.Title>
                              <Card.Text>
                                I am a card that you can drag!
                              </Card.Text>
                              <Card.Body className="text-center p-0">
                                <Button
                                  type="button"
                                  variant="danger"
                                  className="btn-sm w-50"
                                  onClick={() => {
                                    const newState = [...state];
                                    newState[ind].splice(index, 1);
                                    setState(
                                      newState.filter((group) => group.length)
                                    );
                                  }}
                                >
                                  delete
                                </Button>
                              </Card.Body>
                            </Card>
                          </div>
                        );
                      }}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
};
