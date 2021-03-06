import React from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { Accordion } from "components/Accordion";
import { PatchStatusBadge } from "components/PatchStatusBadge";
import { TasksTable } from "components/Table/TasksTable";
import { useToastContext } from "context/toast";
import { PatchTasksQuery, PatchTasksQueryVariables } from "gql/generated/types";
import { GET_PATCH_TASKS } from "gql/queries";
import { useNetworkStatus } from "hooks";

interface DownstreamProjectAccordionProps {
  projectName: string;
  status: string;
  taskCount: number;
  childPatchId: string;
}
export const DownstreamProjectAccordion: React.FC<DownstreamProjectAccordionProps> = ({
  projectName,
  childPatchId,
  status,
}) => {
  const dispatchToast = useToastContext();

  const { data, startPolling, stopPolling } = useQuery<
    PatchTasksQuery,
    PatchTasksQueryVariables
  >(GET_PATCH_TASKS, {
    variables: {
      patchId: childPatchId,
    },
    fetchPolicy: "cache-and-network",
    onError: (err) => {
      dispatchToast.error(`Error fetching downstream tasks ${err}`);
    },
  });
  const showSkeleton = !data;
  useNetworkStatus(startPolling, stopPolling);
  const { patchTasks } = data || {};

  const variantTitle = (
    <>
      <ProjectTitleWrapper>
        <span data-cy="project-title">{projectName}</span>
      </ProjectTitleWrapper>
      <PatchStatusBadge status={status} />
    </>
  );
  return (
    <AccordionWrapper data-cy="project-accordion">
      <Accordion
        title={variantTitle}
        contents={
          <TableWrapper>
            {/* todo: add pagination and filtering  */}
            {showSkeleton ? (
              <Skeleton active title={false} paragraph={{ rows: 8 }} />
            ) : (
              <TasksTable tasks={patchTasks?.tasks} />
            )}
          </TableWrapper>
        }
      />
    </AccordionWrapper>
  );
};

const AccordionWrapper = styled.div`
  padding-bottom: 12px;
  padding-top: 12px;
`;

const ProjectTitleWrapper = styled.div`
  margin-right: 10px;
  font-weight: bold;
`;

const TableWrapper = styled.div`
  padding-bottom: 15px;
  padding-top: 15px;
`;
