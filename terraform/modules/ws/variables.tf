variable "project_id" {
  description = "The project ID to work in"
  type        = string
}

variable "region" {
  description = "The region to to deploy ressources in"
  type        = string
  default     = "europe-west1"
}

variable "ws_service_name" {
  description = "The name of the Cloud Run service"
  type        = string
}

variable "ws_image" {
  description = "The fully qualified image URL to deploy from Artifact Registry"
  type        = string
}

variable "novu_ws_container_port" {
  description = "The port to expose on the Cloud Run service"
  type        = number
  default     = 3002
}

variable "novu_cloudrun_service_account" {
  description = "The name of the Cloud Run service account"
  type        = string
}

variable "node_env" {
  description = "The environment of the Cloud Run service"
  type        = string
  default     = "local"
}

## MongoDB

variable "mongodb_url" {
  description = "The MongoDB connection string secret name"
  type        = string
  sensitive   = true
}

variable "mongo_max_pool_size" {
  description = "The MongoDB max pool size"
  type        = number
  default     = 200
}

## Redis

variable "redis_url" {
  description = "The Redis connection string"
  type        = string
  sensitive   = true
}

variable "redis_port" {
  description = "The Redis port"
  type        = number
  default     = 6379
}

variable "redis_password" {
  description = "The Redis password secret name"
  type        = string
  sensitive   = true
}

## Encryption

variable "jwt_secret" {
  description = "The JWT secret name"
  type        = string
  sensitive   = true
}

## VPC

variable "vpc_connector" {
  description = "The id of the serverless VPC Access connector"
  type        = string
}
