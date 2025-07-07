variable "project_id" {
  description = "The project ID to work in"
  type        = string
}

variable "account_id" {
  description = "The name of the Cloud Run service account"
  type        = string
  default     = "novu-cloudrun-sa"
}
