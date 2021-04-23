import { DashboardHeader } from "@components/BaseComponents/DashboardHeader";
import {
  Activity,
  CommitActivity,
  UserLandingPageStatistics,
} from "@services/api/Client";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { buildUserInfo } from "@utils/ClientInfo";
import React, { useEffect } from "react";
import { Col, Container, ListGroup, Row } from "react-bootstrap";
import { useSetState } from "react-use";
import { Loader } from "@components/BaseComponents/Loader";
import {
  Tooltip,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Line,
  PieChart,
  Cell,
  Pie,
} from "recharts";
import { distinctProperty } from "@utils/Array";
import { addSpacesToString } from "@utils/Strings";

interface LandingRouteState {
  stats: UserLandingPageStatistics;
  selectedRepo: string;
}

interface IRepoActivity {
  weekTimeStamp: string;
  commits: number;
}

export const LandingRoute = () => {
  const { appState } = AppContainer.useContainer();
  const { showErrorAlert } = AlertContainer.useContainer();
  const [loading, setLoading] = React.useState(false);
  const [state, setState] = useSetState<LandingRouteState>();

  useEffect(() => {
    if (appState?.user && appState?.token) {
      (async () => {
        try {
          setLoading(true);
          const result = await authorisedApiClient(
            appState.token
          ).statistics_GetLandingPageStatistics(buildUserInfo);
          setState({ stats: result });
        } catch (error) {
          showErrorAlert("Error", "Unable to get landing page statistics.");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [appState.token, appState.user]);

  const getGraphData = (
    selectedRepo: string,
    data: { [key: string]: CommitActivity }
  ): IRepoActivity[] => {
    if (!selectedRepo) {
      selectedRepo = Object.keys(data)[0];
      setState({ selectedRepo: selectedRepo });
    }
    const graphPlots = new Array<IRepoActivity>();

    data[selectedRepo].activity
      ?.filter((activity, index, array) => {
        const oneBack = array[index - 1];
        const oneForward = array[index + 1];
        return (
          (oneBack !== undefined && (oneBack?.total ?? 0) > 0) ||
          (oneForward !== undefined && (oneForward?.total ?? 0) > 0) ||
          (activity?.total ?? 0) > 0
        );
      })
      .forEach((activity) => {
        graphPlots.push({
          weekTimeStamp: activity
            .weekTimestamp!.toLocaleString("en-GB", {
              timeZone: "UTC",
            })
            .split(",")[0],
          commits: activity!.total!,
        });
      });
    return graphPlots;
  };

  const getEventsGraphData = (
    data: Activity[]
  ): { type: string; count: number }[] => {
    return distinctProperty(data, (activity) => activity.type).map((type) => ({
      type: addSpacesToString(type!),
      count: data.filter((activity) => activity.type === type).length,
    }));
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return appState?.user === undefined ? (
    <DashboardHeader text={`Welcome please log in`} />
  ) : (
    <>
      <DashboardHeader
        text={`Welcome ${
          appState.user.name ?? appState.user.login ?? "GitHub User"
        }`}
        subtitle={`Public Repos: ${appState.user.publicRepos}   Private Repos: ${appState.user.ownedPrivateRepos}`}
        imageUrl={appState.user.avatarUrl}
      />
      <Container fluid>
        {!loading &&
        state.stats &&
        state.stats.topRepoActivity &&
        state.stats.events ? (
          <>
            <Row>
              <Col sm={4}>
                <h4>Last 3 Repositories Edited</h4>
                <ListGroup variant="flush">
                  {Object.keys(state.stats.topRepoActivity).map((repoName) => (
                    <ListGroup.Item
                      action
                      onClick={() => setState({ selectedRepo: repoName })}
                      key={`${repoName}-item`}
                    >
                      {repoName}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
              <Col sm={8}>
                <h4 className="ml-5">
                  Commit Frequency for: {state.selectedRepo}
                </h4>
                <LineChart
                  width={800}
                  height={500}
                  data={getGraphData(
                    state.selectedRepo,
                    state.stats.topRepoActivity
                  )}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="6 6" />
                  <XAxis dataKey="weekTimeStamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="commits"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </Col>
            </Row>
            <Row>
              <Col sm={8}>
                <h4>Distribution of Events</h4>
                <PieChart width={500} height={500}>
                  <Pie
                    data={getEventsGraphData(state.stats.events)}
                    width={500}
                    height={500}
                    cx={200}
                    cy={200}
                    labelLine={false}
                    outerRadius={160}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="type"
                  >
                    {getEventsGraphData(state.stats.events).map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </Col>
              <Col sm={4}></Col>
            </Row>
          </>
        ) : (
          <Loader />
        )}
        {!loading && !state.stats && <p>Nothing to show!</p>}
      </Container>
    </>
  );
};
