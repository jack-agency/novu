// Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.

package operations

import (
	"mockserver/internal/sdk/models/components"
)

type TopicsV1ControllerGetTopicSubscriberRequest struct {
	// The topic key
	TopicKey string `pathParam:"style=simple,explode=false,name=topicKey"`
	// The external subscriber id
	ExternalSubscriberID string `pathParam:"style=simple,explode=false,name=externalSubscriberId"`
	// A header for idempotency purposes
	IdempotencyKey *string `header:"style=simple,explode=false,name=idempotency-key"`
}

func (o *TopicsV1ControllerGetTopicSubscriberRequest) GetTopicKey() string {
	if o == nil {
		return ""
	}
	return o.TopicKey
}

func (o *TopicsV1ControllerGetTopicSubscriberRequest) GetExternalSubscriberID() string {
	if o == nil {
		return ""
	}
	return o.ExternalSubscriberID
}

func (o *TopicsV1ControllerGetTopicSubscriberRequest) GetIdempotencyKey() *string {
	if o == nil {
		return nil
	}
	return o.IdempotencyKey
}

type TopicsV1ControllerGetTopicSubscriberResponse struct {
	HTTPMeta           components.HTTPMetadata `json:"-"`
	TopicSubscriberDto *components.TopicSubscriberDto
	Headers            map[string][]string
}

func (o *TopicsV1ControllerGetTopicSubscriberResponse) GetHTTPMeta() components.HTTPMetadata {
	if o == nil {
		return components.HTTPMetadata{}
	}
	return o.HTTPMeta
}

func (o *TopicsV1ControllerGetTopicSubscriberResponse) GetTopicSubscriberDto() *components.TopicSubscriberDto {
	if o == nil {
		return nil
	}
	return o.TopicSubscriberDto
}

func (o *TopicsV1ControllerGetTopicSubscriberResponse) GetHeaders() map[string][]string {
	if o == nil {
		return map[string][]string{}
	}
	return o.Headers
}
