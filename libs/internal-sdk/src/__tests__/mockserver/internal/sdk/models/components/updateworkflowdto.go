// Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.

package components

import (
	"encoding/json"
	"errors"
	"fmt"
	"mockserver/internal/sdk/utils"
)

type UpdateWorkflowDtoStepType string

const (
	UpdateWorkflowDtoStepTypeInApp  UpdateWorkflowDtoStepType = "in_app"
	UpdateWorkflowDtoStepTypeEmail  UpdateWorkflowDtoStepType = "email"
	UpdateWorkflowDtoStepTypeSms    UpdateWorkflowDtoStepType = "sms"
	UpdateWorkflowDtoStepTypePush   UpdateWorkflowDtoStepType = "push"
	UpdateWorkflowDtoStepTypeChat   UpdateWorkflowDtoStepType = "chat"
	UpdateWorkflowDtoStepTypeDelay  UpdateWorkflowDtoStepType = "delay"
	UpdateWorkflowDtoStepTypeDigest UpdateWorkflowDtoStepType = "digest"
	UpdateWorkflowDtoStepTypeCustom UpdateWorkflowDtoStepType = "custom"
)

type UpdateWorkflowDtoStep struct {
	InAppStepUpsertDto  *InAppStepUpsertDto  `queryParam:"inline"`
	EmailStepUpsertDto  *EmailStepUpsertDto  `queryParam:"inline"`
	SmsStepUpsertDto    *SmsStepUpsertDto    `queryParam:"inline"`
	PushStepUpsertDto   *PushStepUpsertDto   `queryParam:"inline"`
	ChatStepUpsertDto   *ChatStepUpsertDto   `queryParam:"inline"`
	DelayStepUpsertDto  *DelayStepUpsertDto  `queryParam:"inline"`
	DigestStepUpsertDto *DigestStepUpsertDto `queryParam:"inline"`
	CustomStepUpsertDto *CustomStepUpsertDto `queryParam:"inline"`

	Type UpdateWorkflowDtoStepType
}

func CreateUpdateWorkflowDtoStepInApp(inApp InAppStepUpsertDto) UpdateWorkflowDtoStep {
	typ := UpdateWorkflowDtoStepTypeInApp

	typStr := StepTypeEnum(typ)
	inApp.Type = typStr

	return UpdateWorkflowDtoStep{
		InAppStepUpsertDto: &inApp,
		Type:               typ,
	}
}

func CreateUpdateWorkflowDtoStepEmail(email EmailStepUpsertDto) UpdateWorkflowDtoStep {
	typ := UpdateWorkflowDtoStepTypeEmail

	typStr := StepTypeEnum(typ)
	email.Type = typStr

	return UpdateWorkflowDtoStep{
		EmailStepUpsertDto: &email,
		Type:               typ,
	}
}

func CreateUpdateWorkflowDtoStepSms(sms SmsStepUpsertDto) UpdateWorkflowDtoStep {
	typ := UpdateWorkflowDtoStepTypeSms

	typStr := StepTypeEnum(typ)
	sms.Type = typStr

	return UpdateWorkflowDtoStep{
		SmsStepUpsertDto: &sms,
		Type:             typ,
	}
}

func CreateUpdateWorkflowDtoStepPush(push PushStepUpsertDto) UpdateWorkflowDtoStep {
	typ := UpdateWorkflowDtoStepTypePush

	typStr := StepTypeEnum(typ)
	push.Type = typStr

	return UpdateWorkflowDtoStep{
		PushStepUpsertDto: &push,
		Type:              typ,
	}
}

func CreateUpdateWorkflowDtoStepChat(chat ChatStepUpsertDto) UpdateWorkflowDtoStep {
	typ := UpdateWorkflowDtoStepTypeChat

	typStr := StepTypeEnum(typ)
	chat.Type = typStr

	return UpdateWorkflowDtoStep{
		ChatStepUpsertDto: &chat,
		Type:              typ,
	}
}

func CreateUpdateWorkflowDtoStepDelay(delay DelayStepUpsertDto) UpdateWorkflowDtoStep {
	typ := UpdateWorkflowDtoStepTypeDelay

	typStr := StepTypeEnum(typ)
	delay.Type = typStr

	return UpdateWorkflowDtoStep{
		DelayStepUpsertDto: &delay,
		Type:               typ,
	}
}

func CreateUpdateWorkflowDtoStepDigest(digest DigestStepUpsertDto) UpdateWorkflowDtoStep {
	typ := UpdateWorkflowDtoStepTypeDigest

	typStr := StepTypeEnum(typ)
	digest.Type = typStr

	return UpdateWorkflowDtoStep{
		DigestStepUpsertDto: &digest,
		Type:                typ,
	}
}

func CreateUpdateWorkflowDtoStepCustom(custom CustomStepUpsertDto) UpdateWorkflowDtoStep {
	typ := UpdateWorkflowDtoStepTypeCustom

	typStr := StepTypeEnum(typ)
	custom.Type = typStr

	return UpdateWorkflowDtoStep{
		CustomStepUpsertDto: &custom,
		Type:                typ,
	}
}

func (u *UpdateWorkflowDtoStep) UnmarshalJSON(data []byte) error {

	type discriminator struct {
		Type string `json:"type"`
	}

	dis := new(discriminator)
	if err := json.Unmarshal(data, &dis); err != nil {
		return fmt.Errorf("could not unmarshal discriminator: %w", err)
	}

	switch dis.Type {
	case "in_app":
		inAppStepUpsertDto := new(InAppStepUpsertDto)
		if err := utils.UnmarshalJSON(data, &inAppStepUpsertDto, "", true, false); err != nil {
			return fmt.Errorf("could not unmarshal `%s` into expected (Type == in_app) type InAppStepUpsertDto within UpdateWorkflowDtoStep: %w", string(data), err)
		}

		u.InAppStepUpsertDto = inAppStepUpsertDto
		u.Type = UpdateWorkflowDtoStepTypeInApp
		return nil
	case "email":
		emailStepUpsertDto := new(EmailStepUpsertDto)
		if err := utils.UnmarshalJSON(data, &emailStepUpsertDto, "", true, false); err != nil {
			return fmt.Errorf("could not unmarshal `%s` into expected (Type == email) type EmailStepUpsertDto within UpdateWorkflowDtoStep: %w", string(data), err)
		}

		u.EmailStepUpsertDto = emailStepUpsertDto
		u.Type = UpdateWorkflowDtoStepTypeEmail
		return nil
	case "sms":
		smsStepUpsertDto := new(SmsStepUpsertDto)
		if err := utils.UnmarshalJSON(data, &smsStepUpsertDto, "", true, false); err != nil {
			return fmt.Errorf("could not unmarshal `%s` into expected (Type == sms) type SmsStepUpsertDto within UpdateWorkflowDtoStep: %w", string(data), err)
		}

		u.SmsStepUpsertDto = smsStepUpsertDto
		u.Type = UpdateWorkflowDtoStepTypeSms
		return nil
	case "push":
		pushStepUpsertDto := new(PushStepUpsertDto)
		if err := utils.UnmarshalJSON(data, &pushStepUpsertDto, "", true, false); err != nil {
			return fmt.Errorf("could not unmarshal `%s` into expected (Type == push) type PushStepUpsertDto within UpdateWorkflowDtoStep: %w", string(data), err)
		}

		u.PushStepUpsertDto = pushStepUpsertDto
		u.Type = UpdateWorkflowDtoStepTypePush
		return nil
	case "chat":
		chatStepUpsertDto := new(ChatStepUpsertDto)
		if err := utils.UnmarshalJSON(data, &chatStepUpsertDto, "", true, false); err != nil {
			return fmt.Errorf("could not unmarshal `%s` into expected (Type == chat) type ChatStepUpsertDto within UpdateWorkflowDtoStep: %w", string(data), err)
		}

		u.ChatStepUpsertDto = chatStepUpsertDto
		u.Type = UpdateWorkflowDtoStepTypeChat
		return nil
	case "delay":
		delayStepUpsertDto := new(DelayStepUpsertDto)
		if err := utils.UnmarshalJSON(data, &delayStepUpsertDto, "", true, false); err != nil {
			return fmt.Errorf("could not unmarshal `%s` into expected (Type == delay) type DelayStepUpsertDto within UpdateWorkflowDtoStep: %w", string(data), err)
		}

		u.DelayStepUpsertDto = delayStepUpsertDto
		u.Type = UpdateWorkflowDtoStepTypeDelay
		return nil
	case "digest":
		digestStepUpsertDto := new(DigestStepUpsertDto)
		if err := utils.UnmarshalJSON(data, &digestStepUpsertDto, "", true, false); err != nil {
			return fmt.Errorf("could not unmarshal `%s` into expected (Type == digest) type DigestStepUpsertDto within UpdateWorkflowDtoStep: %w", string(data), err)
		}

		u.DigestStepUpsertDto = digestStepUpsertDto
		u.Type = UpdateWorkflowDtoStepTypeDigest
		return nil
	case "custom":
		customStepUpsertDto := new(CustomStepUpsertDto)
		if err := utils.UnmarshalJSON(data, &customStepUpsertDto, "", true, false); err != nil {
			return fmt.Errorf("could not unmarshal `%s` into expected (Type == custom) type CustomStepUpsertDto within UpdateWorkflowDtoStep: %w", string(data), err)
		}

		u.CustomStepUpsertDto = customStepUpsertDto
		u.Type = UpdateWorkflowDtoStepTypeCustom
		return nil
	}

	return fmt.Errorf("could not unmarshal `%s` into any supported union types for UpdateWorkflowDtoStep", string(data))
}

func (u UpdateWorkflowDtoStep) MarshalJSON() ([]byte, error) {
	if u.InAppStepUpsertDto != nil {
		return utils.MarshalJSON(u.InAppStepUpsertDto, "", true)
	}

	if u.EmailStepUpsertDto != nil {
		return utils.MarshalJSON(u.EmailStepUpsertDto, "", true)
	}

	if u.SmsStepUpsertDto != nil {
		return utils.MarshalJSON(u.SmsStepUpsertDto, "", true)
	}

	if u.PushStepUpsertDto != nil {
		return utils.MarshalJSON(u.PushStepUpsertDto, "", true)
	}

	if u.ChatStepUpsertDto != nil {
		return utils.MarshalJSON(u.ChatStepUpsertDto, "", true)
	}

	if u.DelayStepUpsertDto != nil {
		return utils.MarshalJSON(u.DelayStepUpsertDto, "", true)
	}

	if u.DigestStepUpsertDto != nil {
		return utils.MarshalJSON(u.DigestStepUpsertDto, "", true)
	}

	if u.CustomStepUpsertDto != nil {
		return utils.MarshalJSON(u.CustomStepUpsertDto, "", true)
	}

	return nil, errors.New("could not marshal union type UpdateWorkflowDtoStep: all fields are null")
}

type UpdateWorkflowDto struct {
	// Name of the workflow
	Name string `json:"name"`
	// Description of the workflow
	Description *string `json:"description,omitempty"`
	// Tags associated with the workflow
	Tags []string `json:"tags,omitempty"`
	// Whether the workflow is active
	Active *bool `default:"false" json:"active"`
	// Workflow ID (allowed only for code-first workflows)
	WorkflowID *string `json:"workflowId,omitempty"`
	// Steps of the workflow
	Steps []UpdateWorkflowDtoStep `json:"steps"`
	// Workflow preferences
	Preferences PreferencesRequestDto `json:"preferences"`
	// Origin of the workflow
	Origin ResourceOriginEnum `json:"origin"`
	// The payload JSON Schema for the workflow
	PayloadSchema map[string]any `json:"payloadSchema,omitempty"`
	// Enable or disable payload schema validation
	ValidatePayload *bool `json:"validatePayload,omitempty"`
}

func (u UpdateWorkflowDto) MarshalJSON() ([]byte, error) {
	return utils.MarshalJSON(u, "", false)
}

func (u *UpdateWorkflowDto) UnmarshalJSON(data []byte) error {
	if err := utils.UnmarshalJSON(data, &u, "", false, false); err != nil {
		return err
	}
	return nil
}

func (o *UpdateWorkflowDto) GetName() string {
	if o == nil {
		return ""
	}
	return o.Name
}

func (o *UpdateWorkflowDto) GetDescription() *string {
	if o == nil {
		return nil
	}
	return o.Description
}

func (o *UpdateWorkflowDto) GetTags() []string {
	if o == nil {
		return nil
	}
	return o.Tags
}

func (o *UpdateWorkflowDto) GetActive() *bool {
	if o == nil {
		return nil
	}
	return o.Active
}

func (o *UpdateWorkflowDto) GetWorkflowID() *string {
	if o == nil {
		return nil
	}
	return o.WorkflowID
}

func (o *UpdateWorkflowDto) GetSteps() []UpdateWorkflowDtoStep {
	if o == nil {
		return []UpdateWorkflowDtoStep{}
	}
	return o.Steps
}

func (o *UpdateWorkflowDto) GetPreferences() PreferencesRequestDto {
	if o == nil {
		return PreferencesRequestDto{}
	}
	return o.Preferences
}

func (o *UpdateWorkflowDto) GetOrigin() ResourceOriginEnum {
	if o == nil {
		return ResourceOriginEnum("")
	}
	return o.Origin
}

func (o *UpdateWorkflowDto) GetPayloadSchema() map[string]any {
	if o == nil {
		return nil
	}
	return o.PayloadSchema
}

func (o *UpdateWorkflowDto) GetValidatePayload() *bool {
	if o == nil {
		return nil
	}
	return o.ValidatePayload
}
