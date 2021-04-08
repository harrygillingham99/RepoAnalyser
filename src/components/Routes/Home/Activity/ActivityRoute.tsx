import { DashboardHeader } from "@components/BaseComponents/DashboardHeader";
import { Loader } from "@components/BaseComponents/Loader";
import { UserActivity } from "@services/api/Client";
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
        return [eventType ?? "Unknown", "blue", <Github />];
    }
  };

  return (
    <>
      <DashboardHeader text="Activity" />
      {!loading && state.userActivity && state.userActivity.events && (
        <>
          <VerticalTimeline>
            {state.userActivity.events.map((event) => {
              const [
                friendlyEventName,
                colour,
                icon,
              ] = getIconColourFriendlyNameForEvent(event.type);
              return (
                <VerticalTimelineElement
                  key={`timeLineItem-${event.id}`}
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
                    {event.repo?.name}
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
        </>
      )}
      {loading && <Loader />}
    </>
  );
};
