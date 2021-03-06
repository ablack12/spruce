import { render, fireEvent } from "test_utils/test-utils";
import { SpruceForm } from ".";

describe("basic form", () => {
  test("should render as expected", () => {
    const onChange = jest.fn();
    const { container, getByLabelText } = render(
      <SpruceForm
        schema={basicForm.schema}
        title="Just a test"
        formData={basicForm.formData}
        onChange={onChange}
      />
    );
    expect(getByLabelText("Project Cloning Method")).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
  test("Updating the form should trigger a callback and update the form state", () => {
    let data = {};
    const onChange = jest.fn((x) => {
      const { formData } = x;
      data = formData;
    });
    const { queryByDataCy } = render(
      <SpruceForm
        schema={basicForm.schema}
        title="Just a test"
        formData={basicForm.formData}
        onChange={onChange}
        uiSchema={basicForm.uiSchema}
      />
    );
    fireEvent.change(queryByDataCy("valid-projects-input"), {
      target: { value: "new value" },
    });
    expect(onChange).toHaveBeenCalled();
    expect(queryByDataCy("valid-projects-input")).toHaveValue("new value");
    expect(data).toStrictEqual({
      ...basicForm.formData,
      validProjects: "new value",
    });
  });
});

const basicForm = {
  schema: {
    type: "object" as "object",
    properties: {
      cloneMethod: {
        type: "string" as "string",
        title: "Project Cloning Method",
        enum: ["legacy-ssh", "oath-token"],
        enumNames: ["Legacy SSH", "Oath Token"],
      },
      validProjects: {
        type: "string" as "string",
        title: "Valid Projects",
        placeholder: "Sample input",
      },
    },
  },
  formData: {
    cloneMethod: "legacy-ssh",
    validProjects: "spruce",
  },
  uiSchema: {
    validProjects: {
      "ui:widget": "textarea",
      "ui:options": {
        "data-cy": "valid-projects-input",
        label: false,
      },
      cloneMethod: {
        "ui:options": {
          label: false,
        },
      },
    },
  },
};
