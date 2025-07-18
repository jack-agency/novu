// Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.

package operations

import (
	"mockserver/internal/sdk/models/components"
)

type SubscribersV1ControllerDeleteSubscriberCredentialsRequest struct {
	SubscriberID string `pathParam:"style=simple,explode=false,name=subscriberId"`
	ProviderID   string `pathParam:"style=simple,explode=false,name=providerId"`
	// A header for idempotency purposes
	IdempotencyKey *string `header:"style=simple,explode=false,name=idempotency-key"`
}

func (o *SubscribersV1ControllerDeleteSubscriberCredentialsRequest) GetSubscriberID() string {
	if o == nil {
		return ""
	}
	return o.SubscriberID
}

func (o *SubscribersV1ControllerDeleteSubscriberCredentialsRequest) GetProviderID() string {
	if o == nil {
		return ""
	}
	return o.ProviderID
}

func (o *SubscribersV1ControllerDeleteSubscriberCredentialsRequest) GetIdempotencyKey() *string {
	if o == nil {
		return nil
	}
	return o.IdempotencyKey
}

type SubscribersV1ControllerDeleteSubscriberCredentialsResponse struct {
	HTTPMeta components.HTTPMetadata `json:"-"`
	Headers  map[string][]string
}

func (o *SubscribersV1ControllerDeleteSubscriberCredentialsResponse) GetHTTPMeta() components.HTTPMetadata {
	if o == nil {
		return components.HTTPMetadata{}
	}
	return o.HTTPMeta
}

func (o *SubscribersV1ControllerDeleteSubscriberCredentialsResponse) GetHeaders() map[string][]string {
	if o == nil {
		return map[string][]string{}
	}
	return o.Headers
}
