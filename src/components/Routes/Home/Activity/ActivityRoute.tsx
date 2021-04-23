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
import useListTransform, {
  MapTransformer,
  TransformerParams,
  Transformer,
} from "use-list-transform";
import { Container, Dropdown, Row } from "react-bootstrap";
import { addSpacesToString } from "@utils/Strings";
import { distinctProperty } from "@utils/Array";

interface IActivityRouteState {
  userActivity: UserActivity;
  page: number;
  pageSize: number;
}

type OrderBy = "Newest" | "Oldest";

interface IFilterData {
  type?: string;
  orderBy?: OrderBy;
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
        window.scrollTo(0, 0);
        setLoading(false);
      }
    })();
    /* eslint-disable-next-line react-hooks/exhaustive-deps*/
  }, [state.page, state.pageSize]);

  const filterByProperty: MapTransformer<Activity, IFilterData> = (
    params: TransformerParams<Activity, IFilterData>
  ) => (item: Activity) => {
    if (params.data?.type) {
      return params.data.type === item.type;
    }
    return true;
  };

  const orderByDate: Transformer<Activity, IFilterData> = (
    params: TransformerParams<Activity, IFilterData>
  ): Activity[] => {
    if (params.data?.orderBy) {
      return params.list.sort((a, b) => {
        if (params.data.orderBy === "Oldest") {
          return +a!.createdAt! - +b!.createdAt!;
        }
        return +b!.createdAt! - +a!.createdAt!;
      });
    }
    return params.list;
  };

  const { transformed, setData, transformData } = useListTransform<
    IFilterData,
    Activity
  >({
    list: state?.userActivity?.events ?? new Array<Activity>(),
    transform: [filterByProperty, orderByDate],
    onLoading: (loading) => setLoading(loading),
  });

  const getIconColourFriendlyNameForEvent = (
    eventType?: string
  ): [string, string, React.ReactNode] => {
    switch (eventType) {
      case "PullRequestEvent":
        return ["Pull Request", "#28a745", <Arrow90degRight />];
      case "PushEvent":
        return ["Push", "#17a2b8", <ArrowUp />];
      case "ForkEvent":
        return ["Fork", "#17a2b8", <ArrowBarRight />];
      case "PullRequestReviewEvent":
        return ["Pull Request Review", "#28a745", <Search />];
      case "ReleaseEvent":
        return ["Release", "blue", <Asterisk />];
      case "PublicEvent":
        return ["Public", "#ffc107", <People />];
      case "MemberEvent":
        return ["Collaborator", "#5a6268", <PersonPlus />];
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

  const getFreindlyNameForEvent = (event?: string) =>
    getIconColourFriendlyNameForEvent(event)[0];

  const shortRepoName = (repoName: string) => {
    const split = repoName.split("/");
    if (split.length < 1) {
      throw new Error("Sequence contains no elements");
    }
    return split[split.length - 1];
  };

  const getDateRangeString = (events: Activity[], order?: OrderBy) => {
    if (order === undefined) order = "Newest";
    const sorted = events.sort((a, b) => {
      if (order === "Newest") {
        return +b!.createdAt! - +a!.createdAt!;
      }
      return +a!.createdAt! - +b!.createdAt!;
    });

    const min = sorted[0].createdAt
      ?.toLocaleString("en-GB", {
        timeZone: "UTC",
      })
      .split(",")[0];

    const max = sorted[sorted.length - 1].createdAt
      ?.toLocaleString("en-GB", {
        timeZone: "UTC",
      })
      .split(",")[0];
    return `From ${min}   To: ${max}`;
  };

  const dateString =
    state.userActivity?.events &&
    getDateRangeString(state.userActivity.events, transformData?.orderBy);

  return (
    <>
      <DashboardHeader text="Activity" />
      {!loading && state.userActivity && state.userActivity.events && (
        <Container fluid>
          <Row className="ml-auto">
            <Dropdown>
              <Dropdown.Toggle variant="info">{`${
                transformData?.type
                  ? getFreindlyNameForEvent(transformData.type)
                  : "All"
              } Events`}</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setData({ type: undefined })}>
                  All
                </Dropdown.Item>
                {distinctProperty(
                  state.userActivity.events,
                  (event) => event.type
                ).map((type) => (
                  <Dropdown.Item
                    onClick={() => setData({ type: type })}
                    key={`${type!}-Filter`}
                  >
                    {addSpacesToString(type!)}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown className="ml-1">
              <Dropdown.Toggle variant="info">
                {transformData?.orderBy ?? "Newest"} First
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {(["Newest", "Oldest"] as OrderBy[]).map((option) => (
                  <Dropdown.Item
                    onClick={() => setData({ orderBy: option })}
                    key={option}
                  >
                    {option}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Row>
          <Row className="justify-content-center">
            <h4>{dateString}</h4>
          </Row>
          <Row className="justify-content-center">
            <VerticalTimeline>
              {transformed.map((event) => {
                const [
                  friendlyEventName,
                  colour,
                  icon,
                ] = getIconColourFriendlyNameForEvent(event.type);
                const name = shortRepoName(event.repo?.name ?? "Unknown");
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
                        href={`https://github.com/${event.actor?.login}/${name}`}
                        className="text-reset"
                      >
                        {name}
                      </a>
                    </h4>
                    <p>
                      {`Created at: ${event.createdAt?.toLocaleString("en-GB", {
                        timeZone: "UTC",
                      })}`}
                    </p>
                    {event.actor && <p>User: {event.actor.login}</p>}
                    {event.public !== undefined && (
                      <p>Public Event: {event.public ? "true" : "false"}</p>
                    )}
                  </VerticalTimelineElement>
                );
              })}
            </VerticalTimeline>
          </Row>
          <Row className="justify-content-center">
            <PaginationHandler
              setPage={(page) => setState({ page: page })}
              setPageSize={(pageSize) => setState({ pageSize: pageSize })}
              page={state.page}
              pageSize={state.pageSize}
            />
          </Row>
        </Container>
      )}
      {loading && <Loader />}
    </>
  );
};
