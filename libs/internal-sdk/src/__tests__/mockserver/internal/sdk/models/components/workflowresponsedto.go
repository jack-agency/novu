// Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.

package components

import (
	"encoding/json"
	"errors"
	"fmt"
	"mockserver/internal/sdk/utils"
)

type WorkflowResponseDtoStepType string

const (
	WorkflowResponseDtoStepTypeInApp  WorkflowResponseDtoStepType = "in_app"
	WorkflowResponseDtoStepTypeEmail  WorkflowResponseDtoStepType = "email"
	WorkflowResponseDtoStepTypeSms    WorkflowResponseDtoStepType = "sms"
	WorkflowResponseDtoStepTypePush   WorkflowResponseDtoStepType = "push"
	WorkflowResponseDtoStepTypeChat   WorkflowResponseDtoStepType = "chat"
	WorkflowResponseDtoStepTypeDelay  WorkflowResponseDtoStepType = "delay"
	WorkflowResponseDtoStepTypeDigest WorkflowResponseDtoStepType = "digest"
	WorkflowResponseDtoStepTypeCustom WorkflowResponseDtoStepType = "custom"
)

type WorkflowResponseDtoStep struct {
	InAppStepResponseDto  *InAppStepResponseDto  `queryParam:"inline"`
	EmailStepResponseDto  *EmailStepResponseDto  `queryParam:"inline"`
	SmsStepResponseDto    *SmsStepResponseDto    `queryParam:"inline"`
	PushStepResponseDto   *PushStepResponseDto   `queryParam:"inline"`
	ChatStepResponseDto   *ChatStepResponseDto   `queryParam:"inline"`
	DelayStepResponseDto  *DelayStepResponseDto  `queryParam:"inline"`
	DigestStepResponseDto *DigestStepResponseDto `queryParam:"inline"`
	CustomStepResponseDto *CustomStepResponseDto `queryParam:"inline"`

	Type WorkflowResponseDtoStepType
}

func CreateWorkflowResponseDtoStepInApp(inApp InAppStepResponseDto) WorkflowResponseDtoStep {
	typ := WorkflowResponseDtoStepTypeInApp

	typStr := StepTypeEnum(typ)
	inApp.Type = typStr

	return WorkflowResponseDtoStep{
		InAppStepResponseDto: &inApp,
		Type:                 typ,
	}
}

func CreateWorkflowResponseDtoStepEmail(email EmailStepResponseDto) WorkflowResponseDtoStep {
	typ := WorkflowResponseDtoStepTypeEmail

	typStr := StepTypeEnum(typ)
	email.Type = typStr

	return WorkflowResponseDtoStep{
		EmailStepResponseDto: &email,
		Type:                 typ,
	}
}

func CreateWorkflowResponseDtoStepSms(sms SmsStepResponseDto) WorkflowResponseDtoStep {
	typ := WorkflowResponseDtoStepTypeSms

	typStr := StepTypeEnum(typ)
	sms.Type = typStr

	return WorkflowResponseDtoStep{
		SmsStepResponseDto: &sms,
		Type:               typ,
	}
}

func CreateWorkflowResponseDtoStepPush(push PushStepResponseDto) WorkflowResponseDtoStep {
	typ := WorkflowResponseDtoStepTypePush

	typStr := StepTypeEnum(typ)
	push.Type = typStr

	return WorkflowResponseDtoStep{
		PushStepResponseDto: &push,
		Type:                typ,
	}
}

func CreateWorkflowResponseDtoStepChat(chat ChatStepResponseDto) WorkflowResponseDtoStep {
	typ := WorkflowResponseDtoStepTypeChat

	typStr := StepTypeEnum(typ)
	chat.Type = typStr

	return WorkflowResponseDtoStep{
		ChatStepResponseDto: &chat,
		Type:                typ,
	}
}

func CreateWorkflowResponseDtoStepDelay(delay DelayStepResponseDto) WorkflowResponseDtoStep {
	typ := WorkflowResponseDtoStepTypeDelay

	typStr := StepTypeEnum(typ)
	delay.Type = typStr

	return WorkflowResponseDtoStep{
		DelayStepResponseDto: &delay,
		Type:                 typ,
	}
}

func CreateWorkflowResponseDtoStepDigest(digest DigestStepResponseDto) WorkflowResponseDtoStep {
	typ := WorkflowResponseDtoStepTypeDigest

	typStr := StepTypeEnum(typ)
	digest.Type = typStr

	return WorkflowResponseDtoStep{
		DigestStepResponseDto: &digest,
		Type:                  typ,
	}
}

func CreateWorkflowResponseDtoStepCustom(custom CustomStepResponseDto) WorkflowResponseDtoStep {
	typ := WorkflowResponseDtoStepTypeCustom

	typStr := StepTypeEnum(typ)
	custom.Type = typStr

	return WorkflowResponseDtoStep{
		CustomStepResponseDto: &custom,
		Type:                  typ,
	}
}

func (u *WorkflowResponseDtoStep) UnmarshalJSON(data []byte) error {

	type discriminator struct {
		Type string `json:"type"`
	}

	dis := new(discriminator)
	if err := json.Unmarshal(data, &dis); err != nil {
		return fmt.Errorf("could not unmarshal discriminator: %w", err)
	}

	switch dis.Type {
	case "in_app":
		inAppStepResponseDto := new(InAppStepResponseDto)
		if err := utils.UnmarshalJSON(data, &inAppStepResponseDto, "", true, false); err != nil {
			return fmt.Errorf("could not unmarshal `%s` into expected (Type == in_app) type InAppStepResponseDto within WorkflowResponseDtoStep: %w", string(data), err)
		}

		u.InAppStepResponseDto = inAppStepResponseDto
		u.Type = WorkflowResponseDtoStepTypeInApp
		return nil
	case "email":
		emailStepResponseDto := new(EmailStepResponseDto)
		if err := utils.UnmarshalJSON(data, &emailStepResponseDto, "", true, false); err != nil {
			return fmt.Errorf("could not unmarshal `%s` into expected (Type == email) type EmailStepResponseDto within WorkflowResponseDtoStep: %w", string(data), err)
		}

		u.EmailStepResponseDto = emailStepResponseDto
		u.Type = WorkflowResponseDtoStepTypeEmail
		return nil
	case "sms":
		smsStepResponseDto := new(SmsStepResponseDto)
		if err := utils.UnmarshalJSON(data, &smsStepResponseDto, "", true, false); err != nil {
			return fmt.Errorf("could not unmarshal `%s` into expected (Type == sms) type SmsStepResponseDto within WorkflowResponseDtoStep: %w", string(data), err)
		}

		u.SmsStepResponseDto = smsStepResponseDto
		u.Type = WorkflowResponseDtoStepTypeSms
		return nil
	case "push":
		pushStepResponseDto := new(PushStepResponseDto)
		if err := utils.UnmarshalJSON(data, &pushStepResponseDto, "", true, false); err != nil {
			return fmt.Errorf("could not unmarshal `%s` into expected (Type == push) type PushStepResponseDto within WorkflowResponseDtoStep: %w", string(data), err)
		}

		u.PushStepResponseDto = pushStepResponseDto
		u.Type = WorkflowResponseDtoStepTypePush
		return nil
	case "chat":
		chatStepResponseDto := new(ChatStepResponseDto)
		if err := utils.UnmarshalJSON(data, &chatStepResponseDto, "", true, false); err != nil {
			return fmt.Errorf("could not unmarshal `%s` into expected (Type == chat) type ChatStepResponseDto within WorkflowResponseDtoStep: %w", string(data), err)
		}

		u.ChatStepResponseDto = chatStepResponseDto
		u.Type = WorkflowResponseDtoStepTypeChat
		return nil
	case "delay":
		delayStepResponseDto := new(DelayStepResponseDto)
		if err := utils.UnmarshalJSON(data, &delayStepResponseDto, "", true, false); err != nil {
			return fmt.Errorf("could not unmarshal `%s` into expected (Type == delay) type DelayStepResponseDto within WorkflowResponseDtoStep: %w", string(data), err)
		}

		u.DelayStepResponseDto = delayStepResponseDto
		u.Type = WorkflowResponseDtoStepTypeDelay
		return nil
	case "digest":
		digestStepResponseDto := new(DigestStepResponseDto)
		if err := utils.UnmarshalJSON(data, &digestStepResponseDto, "", true, false); err != nil {
			return fmt.Errorf("could not unmarshal `%s` into expected (Type == digest) type DigestStepResponseDto within WorkflowResponseDtoStep: %w", string(data), err)
		}

		u.DigestStepResponseDto = digestStepResponseDto
		u.Type = WorkflowResponseDtoStepTypeDigest
		return nil
	case "custom":
		customStepResponseDto := new(CustomStepResponseDto)
		if err := utils.UnmarshalJSON(data, &customStepResponseDto, "", true, false); err != nil {
			return fmt.Errorf("could not unmarshal `%s` into expected (Type == custom) type CustomStepResponseDto within WorkflowResponseDtoStep: %w", string(data), err)
		}

		u.CustomStepResponseDto = customStepResponseDto
		u.Type = WorkflowResponseDtoStepTypeCustom
		return nil
	}

	return fmt.Errorf("could not unmarshal `%s` into any supported union types for WorkflowResponseDtoStep", string(data))
}

func (u WorkflowResponseDtoStep) MarshalJSON() ([]byte, error) {
	if u.InAppStepResponseDto != nil {
		return utils.MarshalJSON(u.InAppStepResponseDto, "", true)
	}

	if u.EmailStepResponseDto != nil {
		return utils.MarshalJSON(u.EmailStepResponseDto, "", true)
	}

	if u.SmsStepResponseDto != nil {
		return utils.MarshalJSON(u.SmsStepResponseDto, "", true)
	}

	if u.PushStepResponseDto != nil {
		return utils.MarshalJSON(u.PushStepResponseDto, "", true)
	}

	if u.ChatStepResponseDto != nil {
		return utils.MarshalJSON(u.ChatStepResponseDto, "", true)
	}

	if u.DelayStepResponseDto != nil {
		return utils.MarshalJSON(u.DelayStepResponseDto, "", true)
	}

	if u.DigestStepResponseDto != nil {
		return utils.MarshalJSON(u.DigestStepResponseDto, "", true)
	}

	if u.CustomStepResponseDto != nil {
		return utils.MarshalJSON(u.CustomStepResponseDto, "", true)
	}

	return nil, errors.New("could not marshal union type WorkflowResponseDtoStep: all fields are null")
}

type WorkflowResponseDto struct {
	// Name of the workflow
	Name string `json:"name"`
	// Description of the workflow
	Description *string `json:"description,omitempty"`
	// Tags associated with the workflow
	Tags []string `json:"tags,omitempty"`
	// Whether the workflow is active
	Active *bool `default:"false" json:"active"`
	// Unique identifier of the workflow
	ID string `json:"_id"`
	// Workflow identifier
	WorkflowID string `json:"workflowId"`
	// Slug of the workflow
	Slug string `json:"slug"`
	// Last updated timestamp
	UpdatedAt string `json:"updatedAt"`
	// Creation timestamp
	CreatedAt string `json:"createdAt"`
	// Steps of the workflow
	Steps []WorkflowResponseDtoStep `json:"steps"`
	// Origin of the workflow
	Origin ResourceOriginEnum `json:"origin"`
	// Preferences for the workflow
	Preferences WorkflowPreferencesResponseDto `json:"preferences"`
	// Status of the workflow
	Status WorkflowStatusEnum `json:"status"`
	// Runtime issues for workflow creation and update
	Issues map[string]RuntimeIssueDto `json:"issues,omitempty"`
	// Timestamp of the last workflow trigger
	LastTriggeredAt *string `json:"lastTriggeredAt,omitempty"`
	// The payload JSON Schema for the workflow
	PayloadSchema map[string]any `json:"payloadSchema,omitempty"`
	// Generated payload example based on the payload schema
	PayloadExample map[string]any `json:"payloadExample,omitempty"`
	// Whether payload schema validation is enabled
	ValidatePayload *bool `json:"validatePayload,omitempty"`
}

func (w WorkflowResponseDto) MarshalJSON() ([]byte, error) {
	return utils.MarshalJSON(w, "", false)
}

func (w *WorkflowResponseDto) UnmarshalJSON(data []byte) error {
	if err := utils.UnmarshalJSON(data, &w, "", false, false); err != nil {
		return err
	}
	return nil
}

func (o *WorkflowResponseDto) GetName() string {
	if o == nil {
		return ""
	}
	return o.Name
}

func (o *WorkflowResponseDto) GetDescription() *string {
	if o == nil {
		return nil
	}
	return o.Description
}

func (o *WorkflowResponseDto) GetTags() []string {
	if o == nil {
		return nil
	}
	return o.Tags
}

func (o *WorkflowResponseDto) GetActive() *bool {
	if o == nil {
		return nil
	}
	return o.Active
}

func (o *WorkflowResponseDto) GetID() string {
	if o == nil {
		return ""
	}
	return o.ID
}

func (o *WorkflowResponseDto) GetWorkflowID() string {
	if o == nil {
		return ""
	}
	return o.WorkflowID
}

func (o *WorkflowResponseDto) GetSlug() string {
	if o == nil {
		return ""
	}
	return o.Slug
}

func (o *WorkflowResponseDto) GetUpdatedAt() string {
	if o == nil {
		return ""
	}
	return o.UpdatedAt
}

func (o *WorkflowResponseDto) GetCreatedAt() string {
	if o == nil {
		return ""
	}
	return o.CreatedAt
}

func (o *WorkflowResponseDto) GetSteps() []WorkflowResponseDtoStep {
	if o == nil {
		return []WorkflowResponseDtoStep{}
	}
	return o.Steps
}

func (o *WorkflowResponseDto) GetOrigin() ResourceOriginEnum {
	if o == nil {
		return ResourceOriginEnum("")
	}
	return o.Origin
}

func (o *WorkflowResponseDto) GetPreferences() WorkflowPreferencesResponseDto {
	if o == nil {
		return WorkflowPreferencesResponseDto{}
	}
	return o.Preferences
}

func (o *WorkflowResponseDto) GetStatus() WorkflowStatusEnum {
	if o == nil {
		return WorkflowStatusEnum("")
	}
	return o.Status
}

func (o *WorkflowResponseDto) GetIssues() map[string]RuntimeIssueDto {
	if o == nil {
		return nil
	}
	return o.Issues
}

func (o *WorkflowResponseDto) GetLastTriggeredAt() *string {
	if o == nil {
		return nil
	}
	return o.LastTriggeredAt
}

func (o *WorkflowResponseDto) GetPayloadSchema() map[string]any {
	if o == nil {
		return nil
	}
	return o.PayloadSchema
}

func (o *WorkflowResponseDto) GetPayloadExample() map[string]any {
	if o == nil {
		return nil
	}
	return o.PayloadExample
}

func (o *WorkflowResponseDto) GetValidatePayload() *bool {
	if o == nil {
		return nil
	}
	return o.ValidatePayload
}
