import { ErrorScreen } from "@components/BaseComponents/ErrorScreen";
import { Loader } from "@components/BaseComponents/Loader";
import { PullDiscussionResult } from "@services/api/Client";
import { authorisedApiClient } from "@services/api/Index";
import { AlertContainer } from "@state/AlertContainer";
import { AppContainer } from "@state/AppStateContainer";
import { Routes } from "@typeDefinitions/Routes";
import { buildUserInfo } from "@utils/ClientInfo";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { Chat } from "react-bootstrap-icons";
import React from "react";
import { Col, Container, ListGroup, Row } from "react-bootstrap";
import { useEffectOnce, useSetState } from "react-use";

interface DiscussionProps {
  repoId: number | undefined;
  pullNumber: number | undefined;
}

interface DiscussionState {
  discussion: PullDiscussionResult;
  loading: boolean;
}
export const Discussion = ({ repoId, pullNumber }: DiscussionProps) => {
  const [state, setState] = useSetState<DiscussionState>({
    discussion: undefined!,
    loading: false,
  });
  const colour = "rgb(40, 167, 69)";
  const { showErrorAlert } = AlertContainer.useContainer();
  const { appState } = AppContainer.useContainer();
  useEffectOnce(() => {
    if (!repoId || !pullNumber) return;
    (async () => {
      try {
        setState({ loading: true });
        var result = await authorisedApiClient(
          appState.token
        ).pullRequest_GetPullIssuesAndDiscussion(
          repoId,
          pullNumber,
          buildUserInfo
        );
        setState({ discussion: result });
      } catch (error) {
        showErrorAlert("Error", "Error getting discussion for pull request.");
      } finally {
        setState({ loading: false });
      }
    })();
  });
  return (
    <Container className="mt-1" fluid>
      {!state.loading &&
      state.discussion &&
      state.discussion.discussion &&
      state.discussion.assignedReviewers &&
      state.discussion?.discussion?.length > 0 ? (
        <Row>
          <Col sm={4}>
            {state.discussion.assignedReviewers.length > 0 ? (
              <>
                <h4>Assigned Reviewers</h4>
                <ListGroup variant="flush" className="m-0 p-0">
                  {state.discussion.assignedReviewers.map((user) => (
                    <ListGroup.Item>
                      <img
                        src={user.avatarUrl}
                        alt="GitHub user icon"
                        style={{ height: 50, width: 50 }}
                        className="mr-2"
                      />
                      {user.login}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </>
            ) : (
              <p>No Reviewers Assigned!</p>
            )}
          </Col>
          <Col sm={8}>
            <VerticalTimeline className="p-0">
              <h4>Pull Request Discussion</h4>
              {state.discussion.discussion.map((message) => (
                <VerticalTimelineElement
                  key={`timeLineItem-${message.id?.toString()}`}
                  className="vertical-timeline-element--work"
                  contentStyle={{
                    background: colour,
                    color: "#fff",
                  }}
                  contentArrowStyle={{
                    borderRight: `7px solid  ${colour}`,
                  }}
                  date={message.createdAt?.toDateString()}
                  iconStyle={{ background: colour, color: "#fff" }}
                  icon={<Chat />}
                >
                  <h3 className="vertical-timeline-element-title">
                    {message.user?.login ?? "Unknown user"}
                  </h3>
                  <h4 className="vertical-timeline-element-subtitle">
                    <a href={message.htmlUrl} className="text-reset">
                      {message.body?.replace(">", "Reply:")}
                    </a>
                  </h4>
                  <p>
                    {`Created at: ${message.createdAt?.toLocaleString(
                      "en-GB"
                    )}`}
                  </p>
                </VerticalTimelineElement>
              ))}
            </VerticalTimeline>
          </Col>
        </Row>
      ) : !state.loading &&
        state.discussion &&
        state.discussion.discussion?.length === 0 ? (
        <ErrorScreen
          title="No Discussion"
          message="There is no discussion associated with this pull"
          redirectSubtitle="Back"
          redirectTo={Routes.PullRequests}
          type="tabError"
        />
      ) : (
        <Loader />
      )}
    </Container>
  );
};
