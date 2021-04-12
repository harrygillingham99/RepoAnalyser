import { DashboardHeader } from "@components/BaseComponents/DashboardHeader";
import { Loader } from "@components/BaseComponents/Loader";
import { Activity, UserActivity } from "@services/api/Client";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { buildUserInfo } from "@utils/ClientInfo";
import React, { useEffect, useState } from "react";
import { useSetState } from "react-use";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import {
  Github,
  ArrowUp,
  Arrow90degRight,
  ArrowBarRight,
  Search,
  CloudPlus,
  People,
  Asterisk,
  PersonPlus,
  X,
} from "react-bootstrap-icons";
import { PaginationHandler } from "@components/BaseComponents/PaginationHandler";
import useListTransform from "use-list-transform";
import { Container, Dropdown } from "react-bootstrap";
import { EventTypes } from "@constants/GitHub";
import { addSpacesToString } from "@utils/Strings";

interface IActivityRouteState {
  userActivity: UserActivity;
  page: number;
  pageSize: number;
}
export const ActivityRoute = () => {
  const { appState } = AppContainer.useContainer();
  const { showErrorAlert } = AlertContainer.useContainer();
  const [state, setState] = useSetState<IActivityRouteState>({
    userActivity: undefined!,
    page: 1,
    pageSize: 25,
  });
  const [loading, setLoading] = useState(false);

  const filterByProperty = ({ data }: { data: any }) => (item: Activity) => {
    if (data.type) {
      return data.type === item.type;
    }
    return true;
  };

  const { transformed, setData } = useListTransform({
    list: state?.userActivity?.events ?? new Array<Activity>(),
    transform: [filterByProperty],
    onLoading: (loading) => setLoading(loading),
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const result = await authorisedApiClient(
          appState.token
        ).statistics_GetUserStatistics(
          state.page,
          state.pageSize,
          buildUserInfo
        );
        setState({ userActivity: result });
      } catch (error) {
        showErrorAlert("Error", "Error getting user activity information");
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    })();
    /* eslint-disable-next-line react-hooks/exhaustive-deps*/
  }, [state.page, state.pageSize]);

  const getIconColourFriendlyNameForEvent = (
    eventType?: string
  ): [string, string, React.ReactNode] => {
    switch (eventType) {
      case "PullRequestEvent":
        return ["Pull Request Event", "#28a745", <Arrow90degRight />];
      case "PushEvent":
        return ["Push", "#17a2b8", <ArrowUp />];
      case "ForkEvent":
        return ["Fork", "#17a2b8", <ArrowBarRight />];
      case "PullRequestReviewEvent":
        return ["Pull Request Review", "#28a745", <Search />];
      case "ReleaseEvent":
        return ["Release", "blue", <Asterisk />];
      case "PublicEvent":
        return ["Public Event", "#ffc107", <People />];
      case "MemberEvent":
        return ["Collaborator Event", "#5a6268", <PersonPlus />];
      case "CreateEvent":
        return ["Create", "#5a6268", <CloudPlus />];
      case "DeleteEvent":
        return ["Delete", "#dc3545", <X />];
      default:
        return [
          eventType ? addSpacesToString(eventType) : "Unknown",
          "blue",
          <Github />,
        ];
    }
  };

  return (
    <>
      <DashboardHeader text="Activity" />
      {!loading && state.userActivity && state.userActivity.events && (
        <Container fluid>
          <Dropdown className="">
            <Dropdown.Toggle variant="info">Type Filter</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setData({ type: undefined })}>
                All
              </Dropdown.Item>
              {EventTypes.map((type) => (
                <Dropdown.Item
                  onClick={() => setData({ type: type })}
                  key={`${type}-Filter`}
                >
                  {addSpacesToString(type)}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <VerticalTimeline>
            {transformed.map((event) => {
              const [
                friendlyEventName,
                colour,
                icon,
              ] = getIconColourFriendlyNameForEvent(event.type);
              return (
                <VerticalTimelineElement
                  key={`timeLineItem-${event.id?.toString()}`}
                  className="vertical-timeline-element--work"
                  contentStyle={{
                    background: colour,
                    color: "#fff",
                  }}
                  contentArrowStyle={{
                    borderRight: `7px solid  ${colour}`,
                  }}
                  date={event.createdAt?.toDateString()}
                  iconStyle={{ background: colour, color: "#fff" }}
                  icon={icon}
                >
                  <h3 className="vertical-timeline-element-title">
                    {friendlyEventName}
                  </h3>
                  <h4 className="vertical-timeline-element-subtitle">
                    <a
                      href={`https://github.com/${event.repo?.name}`}
                      className="text-reset"
                    >
                      {event.repo?.name}
                    </a>
                  </h4>
                  <p>
                    {`Created at: ${event.createdAt?.toLocaleString("en-GB", {
                      timeZone: "UTC",
                    })}`}
                  </p>
                </VerticalTimelineElement>
              );
            })}
          </VerticalTimeline>
          <PaginationHandler
            setPage={(page) => setState({ page: page })}
            setPageSize={(pageSize) => setState({ pageSize: pageSize })}
            page={state.page}
            pageSize={state.pageSize}
          />
        </Container>
      )}
      {loading && <Loader />}
    </>
  );
};
