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

variable "vpc_connector" {
  description = "The id of the serverless VPC Access connector"
  type        = string
}
