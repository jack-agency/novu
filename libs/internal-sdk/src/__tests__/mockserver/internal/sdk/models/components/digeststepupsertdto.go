// Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.

package components

import (
	"encoding/json"
	"fmt"
)

// DigestStepUpsertDtoType - The type of digest strategy. Determines which fields are applicable.
type DigestStepUpsertDtoType string

const (
	DigestStepUpsertDtoTypeRegular DigestStepUpsertDtoType = "regular"
	DigestStepUpsertDtoTypeTimed   DigestStepUpsertDtoType = "timed"
)

func (e DigestStepUpsertDtoType) ToPointer() *DigestStepUpsertDtoType {
	return &e
}
func (e *DigestStepUpsertDtoType) UnmarshalJSON(data []byte) error {
	var v string
	if err := json.Unmarshal(data, &v); err != nil {
		return err
	}
	switch v {
	case "regular":
		fallthrough
	case "timed":
		*e = DigestStepUpsertDtoType(v)
		return nil
	default:
		return fmt.Errorf("invalid value for DigestStepUpsertDtoType: %v", v)
	}
}

// DigestStepUpsertDtoUnit - The unit of time for the digest interval (for REGULAR type).
type DigestStepUpsertDtoUnit string

const (
	DigestStepUpsertDtoUnitSeconds DigestStepUpsertDtoUnit = "seconds"
	DigestStepUpsertDtoUnitMinutes DigestStepUpsertDtoUnit = "minutes"
	DigestStepUpsertDtoUnitHours   DigestStepUpsertDtoUnit = "hours"
	DigestStepUpsertDtoUnitDays    DigestStepUpsertDtoUnit = "days"
	DigestStepUpsertDtoUnitWeeks   DigestStepUpsertDtoUnit = "weeks"
	DigestStepUpsertDtoUnitMonths  DigestStepUpsertDtoUnit = "months"
)

func (e DigestStepUpsertDtoUnit) ToPointer() *DigestStepUpsertDtoUnit {
	return &e
}
func (e *DigestStepUpsertDtoUnit) UnmarshalJSON(data []byte) error {
	var v string
	if err := json.Unmarshal(data, &v); err != nil {
		return err
	}
	switch v {
	case "seconds":
		fallthrough
	case "minutes":
		fallthrough
	case "hours":
		fallthrough
	case "days":
		fallthrough
	case "weeks":
		fallthrough
	case "months":
		*e = DigestStepUpsertDtoUnit(v)
		return nil
	default:
		return fmt.Errorf("invalid value for DigestStepUpsertDtoUnit: %v", v)
	}
}

// DigestStepUpsertDtoControlValues - Control values for the Digest step
type DigestStepUpsertDtoControlValues struct {
	// JSONLogic filter conditions for conditionally skipping the step execution. Supports complex logical operations with AND, OR, and comparison operators. See https://jsonlogic.com/ for full typing reference.
	Skip map[string]any `json:"skip,omitempty"`
	// The type of digest strategy. Determines which fields are applicable.
	Type *DigestStepUpsertDtoType `json:"type,omitempty"`
	// The amount of time for the digest interval (for REGULAR type). Min 1.
	Amount *float64 `json:"amount,omitempty"`
	// The unit of time for the digest interval (for REGULAR type).
	Unit *DigestStepUpsertDtoUnit `json:"unit,omitempty"`
	// Configuration for look-back window (for REGULAR type).
	LookBackWindow *LookBackWindowDto `json:"lookBackWindow,omitempty"`
	// Cron expression for TIMED digest. Min length 1.
	Cron *string `json:"cron,omitempty"`
	// Specify a custom key for digesting events instead of the default event key.
	DigestKey *string `json:"digestKey,omitempty"`
}

func (o *DigestStepUpsertDtoControlValues) GetSkip() map[string]any {
	if o == nil {
		return nil
	}
	return o.Skip
}

func (o *DigestStepUpsertDtoControlValues) GetType() *DigestStepUpsertDtoType {
	if o == nil {
		return nil
	}
	return o.Type
}

func (o *DigestStepUpsertDtoControlValues) GetAmount() *float64 {
	if o == nil {
		return nil
	}
	return o.Amount
}

func (o *DigestStepUpsertDtoControlValues) GetUnit() *DigestStepUpsertDtoUnit {
	if o == nil {
		return nil
	}
	return o.Unit
}

func (o *DigestStepUpsertDtoControlValues) GetLookBackWindow() *LookBackWindowDto {
	if o == nil {
		return nil
	}
	return o.LookBackWindow
}

func (o *DigestStepUpsertDtoControlValues) GetCron() *string {
	if o == nil {
		return nil
	}
	return o.Cron
}

func (o *DigestStepUpsertDtoControlValues) GetDigestKey() *string {
	if o == nil {
		return nil
	}
	return o.DigestKey
}

type DigestStepUpsertDto struct {
	// Unique identifier of the step
	ID *string `json:"_id,omitempty"`
	// Name of the step
	Name string `json:"name"`
	// Type of the step
	Type StepTypeEnum `json:"type"`
	// Control values for the Digest step
	ControlValues *DigestStepUpsertDtoControlValues `json:"controlValues,omitempty"`
}

func (o *DigestStepUpsertDto) GetID() *string {
	if o == nil {
		return nil
	}
	return o.ID
}

func (o *DigestStepUpsertDto) GetName() string {
	if o == nil {
		return ""
	}
	return o.Name
}

func (o *DigestStepUpsertDto) GetType() StepTypeEnum {
	if o == nil {
		return StepTypeEnum("")
	}
	return o.Type
}

func (o *DigestStepUpsertDto) GetControlValues() *DigestStepUpsertDtoControlValues {
	if o == nil {
		return nil
	}
	return o.ControlValues
}
