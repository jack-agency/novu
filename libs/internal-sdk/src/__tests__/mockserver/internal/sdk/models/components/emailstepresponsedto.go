// Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.

package components

import (
	"encoding/json"
	"fmt"
	"mockserver/internal/sdk/utils"
)

// EmailStepResponseDtoEditorType - Type of editor to use for the body.
type EmailStepResponseDtoEditorType string

const (
	EmailStepResponseDtoEditorTypeBlock EmailStepResponseDtoEditorType = "block"
	EmailStepResponseDtoEditorTypeHTML  EmailStepResponseDtoEditorType = "html"
)

func (e EmailStepResponseDtoEditorType) ToPointer() *EmailStepResponseDtoEditorType {
	return &e
}
func (e *EmailStepResponseDtoEditorType) UnmarshalJSON(data []byte) error {
	var v string
	if err := json.Unmarshal(data, &v); err != nil {
		return err
	}
	switch v {
	case "block":
		fallthrough
	case "html":
		*e = EmailStepResponseDtoEditorType(v)
		return nil
	default:
		return fmt.Errorf("invalid value for EmailStepResponseDtoEditorType: %v", v)
	}
}

// EmailStepResponseDtoControlValues - Control values for the email step
type EmailStepResponseDtoControlValues struct {
	// JSONLogic filter conditions for conditionally skipping the step execution. Supports complex logical operations with AND, OR, and comparison operators. See https://jsonlogic.com/ for full typing reference.
	Skip map[string]any `json:"skip,omitempty"`
	// Subject of the email.
	Subject string `json:"subject"`
	// Body content of the email, either a valid Maily JSON object, or html string.
	Body *string `default:"" json:"body"`
	// Type of editor to use for the body.
	EditorType *EmailStepResponseDtoEditorType `default:"block" json:"editorType"`
	// Disable sanitization of the output.
	DisableOutputSanitization *bool `default:"false" json:"disableOutputSanitization"`
	// Layout ID to use for the email. Null means no layout, undefined means default layout.
	LayoutID             *string        `json:"layoutId,omitempty"`
	AdditionalProperties map[string]any `additionalProperties:"true" json:"-"`
}

func (e EmailStepResponseDtoControlValues) MarshalJSON() ([]byte, error) {
	return utils.MarshalJSON(e, "", false)
}

func (e *EmailStepResponseDtoControlValues) UnmarshalJSON(data []byte) error {
	if err := utils.UnmarshalJSON(data, &e, "", false, false); err != nil {
		return err
	}
	return nil
}

func (o *EmailStepResponseDtoControlValues) GetSkip() map[string]any {
	if o == nil {
		return nil
	}
	return o.Skip
}

func (o *EmailStepResponseDtoControlValues) GetSubject() string {
	if o == nil {
		return ""
	}
	return o.Subject
}

func (o *EmailStepResponseDtoControlValues) GetBody() *string {
	if o == nil {
		return nil
	}
	return o.Body
}

func (o *EmailStepResponseDtoControlValues) GetEditorType() *EmailStepResponseDtoEditorType {
	if o == nil {
		return nil
	}
	return o.EditorType
}

func (o *EmailStepResponseDtoControlValues) GetDisableOutputSanitization() *bool {
	if o == nil {
		return nil
	}
	return o.DisableOutputSanitization
}

func (o *EmailStepResponseDtoControlValues) GetLayoutID() *string {
	if o == nil {
		return nil
	}
	return o.LayoutID
}

func (o *EmailStepResponseDtoControlValues) GetAdditionalProperties() map[string]any {
	if o == nil {
		return nil
	}
	return o.AdditionalProperties
}

type EmailStepResponseDto struct {
	// Controls metadata for the email step
	Controls EmailControlsMetadataResponseDto `json:"controls"`
	// Control values for the email step
	ControlValues *EmailStepResponseDtoControlValues `json:"controlValues,omitempty"`
	// JSON Schema for variables, follows the JSON Schema standard
	Variables map[string]any `json:"variables"`
	// Unique identifier of the step
	StepID string `json:"stepId"`
	// Database identifier of the step
	ID string `json:"_id"`
	// Name of the step
	Name string `json:"name"`
	// Slug of the step
	Slug string `json:"slug"`
	// Type of the step
	Type StepTypeEnum `json:"type"`
	// Origin of the workflow
	Origin ResourceOriginEnum `json:"origin"`
	// Workflow identifier
	WorkflowID string `json:"workflowId"`
	// Workflow database identifier
	WorkflowDatabaseID string `json:"workflowDatabaseId"`
	// Issues associated with the step
	Issues *StepIssuesDto `json:"issues,omitempty"`
}

func (o *EmailStepResponseDto) GetControls() EmailControlsMetadataResponseDto {
	if o == nil {
		return EmailControlsMetadataResponseDto{}
	}
	return o.Controls
}

func (o *EmailStepResponseDto) GetControlValues() *EmailStepResponseDtoControlValues {
	if o == nil {
		return nil
	}
	return o.ControlValues
}

func (o *EmailStepResponseDto) GetVariables() map[string]any {
	if o == nil {
		return map[string]any{}
	}
	return o.Variables
}

func (o *EmailStepResponseDto) GetStepID() string {
	if o == nil {
		return ""
	}
	return o.StepID
}

func (o *EmailStepResponseDto) GetID() string {
	if o == nil {
		return ""
	}
	return o.ID
}

func (o *EmailStepResponseDto) GetName() string {
	if o == nil {
		return ""
	}
	return o.Name
}

func (o *EmailStepResponseDto) GetSlug() string {
	if o == nil {
		return ""
	}
	return o.Slug
}

func (o *EmailStepResponseDto) GetType() StepTypeEnum {
	if o == nil {
		return StepTypeEnum("")
	}
	return o.Type
}

func (o *EmailStepResponseDto) GetOrigin() ResourceOriginEnum {
	if o == nil {
		return ResourceOriginEnum("")
	}
	return o.Origin
}

func (o *EmailStepResponseDto) GetWorkflowID() string {
	if o == nil {
		return ""
	}
	return o.WorkflowID
}

func (o *EmailStepResponseDto) GetWorkflowDatabaseID() string {
	if o == nil {
		return ""
	}
	return o.WorkflowDatabaseID
}

func (o *EmailStepResponseDto) GetIssues() *StepIssuesDto {
	if o == nil {
		return nil
	}
	return o.Issues
}
