// Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.

package components

type Security struct {
	SecretKey  *string `security:"scheme,type=apiKey,subtype=header,name=Authorization"`
	BearerAuth *string `security:"scheme,type=http,subtype=bearer,name=Authorization"`
}

func (o *Security) GetSecretKey() *string {
	if o == nil {
		return nil
	}
	return o.SecretKey
}

func (o *Security) GetBearerAuth() *string {
	if o == nil {
		return nil
	}
	return o.BearerAuth
}
