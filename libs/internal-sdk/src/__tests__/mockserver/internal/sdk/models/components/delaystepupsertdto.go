// Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.

package components

import (
	"encoding/json"
	"fmt"
	"mockserver/internal/sdk/utils"
)

// DelayStepUpsertDtoType - Type of the delay. Currently only 'regular' is supported by the schema.
type DelayStepUpsertDtoType string

const (
	DelayStepUpsertDtoTypeRegular DelayStepUpsertDtoType = "regular"
)

func (e DelayStepUpsertDtoType) ToPointer() *DelayStepUpsertDtoType {
	return &e
}
func (e *DelayStepUpsertDtoType) UnmarshalJSON(data []byte) error {
	var v string
	if err := json.Unmarshal(data, &v); err != nil {
		return err
	}
	switch v {
	case "regular":
		*e = DelayStepUpsertDtoType(v)
		return nil
	default:
		return fmt.Errorf("invalid value for DelayStepUpsertDtoType: %v", v)
	}
}

// DelayStepUpsertDtoUnit - Unit of time for the delay amount.
type DelayStepUpsertDtoUnit string

const (
	DelayStepUpsertDtoUnitSeconds DelayStepUpsertDtoUnit = "seconds"
	DelayStepUpsertDtoUnitMinutes DelayStepUpsertDtoUnit = "minutes"
	DelayStepUpsertDtoUnitHours   DelayStepUpsertDtoUnit = "hours"
	DelayStepUpsertDtoUnitDays    DelayStepUpsertDtoUnit = "days"
	DelayStepUpsertDtoUnitWeeks   DelayStepUpsertDtoUnit = "weeks"
	DelayStepUpsertDtoUnitMonths  DelayStepUpsertDtoUnit = "months"
)

func (e DelayStepUpsertDtoUnit) ToPointer() *DelayStepUpsertDtoUnit {
	return &e
}
func (e *DelayStepUpsertDtoUnit) UnmarshalJSON(data []byte) error {
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
		*e = DelayStepUpsertDtoUnit(v)
		return nil
	default:
		return fmt.Errorf("invalid value for DelayStepUpsertDtoUnit: %v", v)
	}
}

// DelayStepUpsertDtoControlValues - Control values for the Delay step
type DelayStepUpsertDtoControlValues struct {
	// JSONLogic filter conditions for conditionally skipping the step execution. Supports complex logical operations with AND, OR, and comparison operators. See https://jsonlogic.com/ for full typing reference.
	Skip map[string]any `json:"skip,omitempty"`
	// Type of the delay. Currently only 'regular' is supported by the schema.
	Type *DelayStepUpsertDtoType `default:"regular" json:"type"`
	// Amount of time to delay.
	Amount float64 `json:"amount"`
	// Unit of time for the delay amount.
	Unit DelayStepUpsertDtoUnit `json:"unit"`
}

func (d DelayStepUpsertDtoControlValues) MarshalJSON() ([]byte, error) {
	return utils.MarshalJSON(d, "", false)
}

func (d *DelayStepUpsertDtoControlValues) UnmarshalJSON(data []byte) error {
	if err := utils.UnmarshalJSON(data, &d, "", false, false); err != nil {
		return err
	}
	return nil
}

func (o *DelayStepUpsertDtoControlValues) GetSkip() map[string]any {
	if o == nil {
		return nil
	}
	return o.Skip
}

func (o *DelayStepUpsertDtoControlValues) GetType() *DelayStepUpsertDtoType {
	if o == nil {
		return nil
	}
	return o.Type
}

func (o *DelayStepUpsertDtoControlValues) GetAmount() float64 {
	if o == nil {
		return 0.0
	}
	return o.Amount
}

func (o *DelayStepUpsertDtoControlValues) GetUnit() DelayStepUpsertDtoUnit {
	if o == nil {
		return DelayStepUpsertDtoUnit("")
	}
	return o.Unit
}

type DelayStepUpsertDto struct {
	// Unique identifier of the step
	ID *string `json:"_id,omitempty"`
	// Name of the step
	Name string `json:"name"`
	// Type of the step
	Type StepTypeEnum `json:"type"`
	// Control values for the Delay step
	ControlValues *DelayStepUpsertDtoControlValues `json:"controlValues,omitempty"`
}

func (o *DelayStepUpsertDto) GetID() *string {
	if o == nil {
		return nil
	}
	return o.ID
}

func (o *DelayStepUpsertDto) GetName() string {
	if o == nil {
		return ""
	}
	return o.Name
}

func (o *DelayStepUpsertDto) GetType() StepTypeEnum {
	if o == nil {
		return StepTypeEnum("")
	}
	return o.Type
}

func (o *DelayStepUpsertDto) GetControlValues() *DelayStepUpsertDtoControlValues {
	if o == nil {
		return nil
	}
	return o.ControlValues
}
