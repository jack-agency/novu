variable "region" {
  description = "The region to to deploy ressources in"
  type        = string
  default     = "europe-west1"
}

variable "dashboard_service_name" {
  description = "The name of the Cloud Run service"
  type        = string
}

variable "dashboard_image" {
  description = "The fully qualified image URL to deploy from Artifact Registry"
  type        = string
}

variable "dashboard_port" {
  description = "The port to expose on the Cloud Run service"
  type        = number
  default     = 4000
}

variable "novu_cloudrun_service_account" {
  description = "The name of the Cloud Run service account"
  type        = string
}

variable "vpc_connector" {
  description = "The id of the serverless VPC Access connector"
  type        = string
}

variable "vite_api_hostname" {
  description = "The API hostname for the Vite app"
  type        = string
}

variable "vite_legacy_dashboard_url" {
  description = "The legacy dashboard URL for the Vite app"
  type        = string
}

variable "vite_websocket_hostname" {
  description = "The WebSocket hostname for the Vite app"
  type        = string
}

variable "project_id" {
  description = "The project ID to work in"
  type        = string
}
