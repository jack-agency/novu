variable "project_id" {
  description = "The project ID to work in"
  type        = string
}

variable "region" {
  description = "The region to to deploy ressources in"
  type        = string
  default     = "europe-west1"
}

variable "bridge_image" {
  description = "The fully qualified image URL to deploy from Artifact Registry"
  type        = string
}

variable "novu_cloudrun_service_account" {
  description = "The email of the Cloud Run service account"
  type        = string  
}

variable "novu_secret_key" {
  description = "The Novu secret key stored in Secret Manager"
  type        = string
}

variable "vpc_connector" {
  description = "The id of the serverless VPC Access connector"
  type        = string
}
