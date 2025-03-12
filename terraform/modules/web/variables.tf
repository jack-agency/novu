variable "project_id" {
  description = "The project ID to work in"
  type        = string
}

variable "region" {
  description = "The region to to deploy ressources in"
  type        = string
  default     = "europe-west1"
}

variable "web_service_name" {
  description = "The name of the Cloud Run service"
  type        = string
}

variable "web_image" {
  description = "The fully qualified image URL to deploy from Artifact Registry"
  type        = string
}

variable "web_port" {
  description = "The port to expose on the Cloud Run service"
  type        = number
  default     = 4200
}

variable "react_app_api_url" {
  description = "The URL of the React app API"
  type        = string
}

variable "react_app_environment" {
  description = "The environment of the React app"
  type        = string
  default     = "local"
}

variable "react_app_ws_url" {
  description = "The URL of the React app WS"
  type        = string
}

variable "vpc_connector" {
  description = "The id of the serverless VPC Access connector"
  type        = string
}
