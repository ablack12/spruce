import userEvent from "@testing-library/user-event";
import { render, act } from "test_utils/test-utils";

import { InactiveCommits } from ".";

const RenderInactiveCommits = (versions) => (
  <InactiveCommits rolledUpVersions={versions} />
);

afterEach(() => {
  jest.clearAllTimers();
  jest.clearAllMocks();
});
describe("InactiveCommits", () => {
  test("Displays the correct count of inactive versions with the correct copy", () => {
    const { queryByDataCy, rerender } = render(
      <InactiveCommits rolledUpVersions={versions} />
    );
    expect(queryByDataCy("inactive-commits-button")).toHaveTextContent(
      "6 Inactive Commits"
    );
    rerender(RenderInactiveCommits(versions.slice(0, 1)));
    expect(queryByDataCy("inactive-commits-button")).toHaveTextContent(
      "1 Inactive Commit"
    );
  });

  test("Hovering over the button should open a tooltip", async () => {
    const { queryByDataCy } = render(
      <InactiveCommits rolledUpVersions={versions} />
    );
    jest.useFakeTimers();

    expect(queryByDataCy("inactive-commits-tooltip")).toBeNull();
    userEvent.hover(queryByDataCy("inactive-commits-button"));
    //   Need to use fake timers to get around @leafygreen-ui/tooltip debounce
    act(() => {
      jest.runAllTimers();
    });
    expect(queryByDataCy("inactive-commits-tooltip")).toBeInTheDocument();
  });

  test("Should show all inactive commits if there are 5 or less commits ", async () => {
    const { queryByDataCy, queryAllByDataCy } = render(
      <InactiveCommits rolledUpVersions={versions.slice(0, 4)} />
    );
    jest.useFakeTimers();

    expect(queryByDataCy("inactive-commits-tooltip")).toBeNull();
    userEvent.hover(queryByDataCy("inactive-commits-button"));
    //   Need to use fake timers to get around @leafygreen-ui/tooltip debounce
    act(() => {
      jest.runAllTimers();
    });
    expect(queryByDataCy("inactive-commits-tooltip")).toBeInTheDocument();
    expect(queryAllByDataCy("commit-text")).toHaveLength(4);
    expect(queryByDataCy("hidden-commits")).toBeNull();
  });
  test("Should collapse some commits if there are more then 5 ", async () => {
    const { queryByDataCy, queryAllByDataCy } = render(
      <InactiveCommits rolledUpVersions={versions} />
    );
    jest.useFakeTimers();

    expect(queryByDataCy("inactive-commits-tooltip")).toBeNull();
    userEvent.hover(queryByDataCy("inactive-commits-button"));
    //   Need to use fake timers to get around @leafygreen-ui/tooltip debounce
    act(() => {
      jest.runAllTimers();
    });
    expect(queryByDataCy("inactive-commits-tooltip")).toBeInTheDocument();
    expect(queryAllByDataCy("commit-text")).toHaveLength(5);
    expect(queryByDataCy("hidden-commits")).toBeInTheDocument();
  });
});

const versions = [
  {
    id: "123",
    createTime: "2021-06-16T23:38:13Z",
    message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
    order: 39365,
    author: "Mohamed Khelif",
    githash: "4137c33fa4a0d5c747a1115f0853b5f70e46f112",
  },
  {
    id: "123",
    createTime: "2021-06-16T23:38:13Z",
    message: "SERVER-57333 Some complicated server commit",
    order: 39366,
    author: "Arjun Patel",
    githash: "4237c33fa4a0d5c747a1115f0853b5f70e46f113",
  },
  {
    id: "123",
    createTime: "2021-06-16T23:38:13Z",
    message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
    order: 39365,
    author: "Mohamed Khelif",
    githash: "4337c33fa4a0d5c747a1115f0853b5f70e46f114",
  },
  {
    id: "123",
    createTime: "2021-06-16T23:38:13Z",
    message: "SERVER-57333 Some complicated server commit",
    order: 39366,
    author: "Arjun Patel",
    githash: "4437c33fa4a0d5c747a1115f0853b5f70e46f115",
  },
  {
    id: "123",
    createTime: "2021-06-16T23:38:13Z",
    message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
    order: 39365,
    author: "Elena Chen",
    githash: "4537c33fa4a0d5c747a1115f0853b5f70e46f116",
  },
  {
    id: "123",
    createTime: "2021-06-16T23:38:13Z",
    message: "SERVER-57333 Some complicated server commit",
    order: 39366,
    author: "Sophie Stadler",
    githash: "4637c33fa4a0d5c747a1115f0853b5f70e46f117",
  },
];
