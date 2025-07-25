// Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.

package operations

import (
	"mockserver/internal/sdk/models/components"
)

type SubscribersV1ControllerMarkActionAsSeenRequest struct {
	MessageID    string `pathParam:"style=simple,explode=false,name=messageId"`
	Type         string `pathParam:"style=simple,explode=false,name=type"`
	SubscriberID string `pathParam:"style=simple,explode=false,name=subscriberId"`
	// A header for idempotency purposes
	IdempotencyKey             *string                               `header:"style=simple,explode=false,name=idempotency-key"`
	MarkMessageActionAsSeenDto components.MarkMessageActionAsSeenDto `request:"mediaType=application/json"`
}

func (o *SubscribersV1ControllerMarkActionAsSeenRequest) GetMessageID() string {
	if o == nil {
		return ""
	}
	return o.MessageID
}

func (o *SubscribersV1ControllerMarkActionAsSeenRequest) GetType() string {
	if o == nil {
		return ""
	}
	return o.Type
}

func (o *SubscribersV1ControllerMarkActionAsSeenRequest) GetSubscriberID() string {
	if o == nil {
		return ""
	}
	return o.SubscriberID
}

func (o *SubscribersV1ControllerMarkActionAsSeenRequest) GetIdempotencyKey() *string {
	if o == nil {
		return nil
	}
	return o.IdempotencyKey
}

func (o *SubscribersV1ControllerMarkActionAsSeenRequest) GetMarkMessageActionAsSeenDto() components.MarkMessageActionAsSeenDto {
	if o == nil {
		return components.MarkMessageActionAsSeenDto{}
	}
	return o.MarkMessageActionAsSeenDto
}

type SubscribersV1ControllerMarkActionAsSeenResponse struct {
	HTTPMeta components.HTTPMetadata `json:"-"`
	// Created
	MessageResponseDto *components.MessageResponseDto
	Headers            map[string][]string
}

func (o *SubscribersV1ControllerMarkActionAsSeenResponse) GetHTTPMeta() components.HTTPMetadata {
	if o == nil {
		return components.HTTPMetadata{}
	}
	return o.HTTPMeta
}

func (o *SubscribersV1ControllerMarkActionAsSeenResponse) GetMessageResponseDto() *components.MessageResponseDto {
	if o == nil {
		return nil
	}
	return o.MessageResponseDto
}

func (o *SubscribersV1ControllerMarkActionAsSeenResponse) GetHeaders() map[string][]string {
	if o == nil {
		return map[string][]string{}
	}
	return o.Headers
}
