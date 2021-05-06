import { DashboardHeader } from "@components/BaseComponents/DashboardHeader";
import {
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
import { getRandomColour } from "@utils/Styles";
import { Routes } from "@typeDefinitions/Routes";
import { ErrorScreen } from "@components/BaseComponents/ErrorScreen";

interface LandingRouteState {
  stats: UserLandingPageStatistics;
  pieColours?: { [key: string]: string };
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
          if (!state.pieColours && result.languages) {
            const colours: { [key: string]: string } = {};
            Object.keys(result.languages).forEach(
              (lang) => (colours[lang] = getRandomColour())
            );
            setState({ pieColours: colours });
          }
        } catch (error) {
          showErrorAlert("Error", "Unable to get landing page statistics.");
        } finally {
          setLoading(false);
        }
      })();
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps*/
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
            .weekTimestamp!.toLocaleString("en-GB")
            .split(",")[0],
          commits: activity!.total!,
        });
      });
    return graphPlots;
  };

  const getLanguageGraphData = (data: { [key: string]: number }) =>
    Object.keys(data).map((key: string) => ({
      type: key,
      count: data![key],
    }));

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
      <Container fluid className="justify-content-center">
        {!loading &&
        state.stats &&
        state.stats.topRepoActivity &&
        state.stats.languages ? (
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
                <h4>Distribution of Languages (%)</h4>
                <PieChart width={500} height={500}>
                  <Pie
                    data={getLanguageGraphData(state.stats.languages)}
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
                    {getLanguageGraphData(state.stats.languages).map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            state.pieColours
                              ? state.pieColours[entry.type]
                              : getRandomColour()
                          }
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
        {!loading && !state.stats && (
          <ErrorScreen
            title="Nothing to show!"
            message={`You have no data to analyse, please check your GitHub account status.`}
            redirectSubtitle="Sign Out"
            redirectTo={Routes.Settings}
            type="tabError"
          />
        )}
      </Container>
    </>
  );
};
