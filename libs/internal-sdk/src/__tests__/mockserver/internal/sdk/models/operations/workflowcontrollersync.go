// Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.

package operations

import (
	"mockserver/internal/sdk/models/components"
)

type WorkflowControllerSyncRequest struct {
	WorkflowID string `pathParam:"style=simple,explode=false,name=workflowId"`
	// A header for idempotency purposes
	IdempotencyKey *string `header:"style=simple,explode=false,name=idempotency-key"`
	// Sync workflow details
	SyncWorkflowDto components.SyncWorkflowDto `request:"mediaType=application/json"`
}

func (o *WorkflowControllerSyncRequest) GetWorkflowID() string {
	if o == nil {
		return ""
	}
	return o.WorkflowID
}

func (o *WorkflowControllerSyncRequest) GetIdempotencyKey() *string {
	if o == nil {
		return nil
	}
	return o.IdempotencyKey
}

func (o *WorkflowControllerSyncRequest) GetSyncWorkflowDto() components.SyncWorkflowDto {
	if o == nil {
		return components.SyncWorkflowDto{}
	}
	return o.SyncWorkflowDto
}

type WorkflowControllerSyncResponse struct {
	HTTPMeta components.HTTPMetadata `json:"-"`
	// OK
	WorkflowResponseDto *components.WorkflowResponseDto
	Headers             map[string][]string
}

func (o *WorkflowControllerSyncResponse) GetHTTPMeta() components.HTTPMetadata {
	if o == nil {
		return components.HTTPMetadata{}
	}
	return o.HTTPMeta
}

func (o *WorkflowControllerSyncResponse) GetWorkflowResponseDto() *components.WorkflowResponseDto {
	if o == nil {
		return nil
	}
	return o.WorkflowResponseDto
}

func (o *WorkflowControllerSyncResponse) GetHeaders() map[string][]string {
	if o == nil {
		return map[string][]string{}
	}
	return o.Headers
}
