## Project 
variable "project_id" {
  description = "The project ID to work in"
  type        = string
  default     = "jack-lucius-dev"
}

variable "region" {
  description = "The region to to deploy ressources in"
  type        = string
  default     = "europe-west1"
}

## Redis
variable "location_id" {
  description = "The location id to deploy the redis instance in"
  type        = string
  default     = "europe-west1-c"
}

variable "instance_name" {
  description = "The name of the Redis instance"
  type        = string
  default     = "novu-redis"
}

variable "tier" {
  description = "The tier of the Redis instance"
  type        = string
  default     = "BASIC"
}

variable "memory_size_gb" {
  description = "The memory size of the Redis instance"
  type        = number
  default     = 1
}

variable "redis_version" {
  description = "The Redis version to use"
  type        = string
  default     = "REDIS_7_0"
}

## Web
variable "web_service_name" {
  description = "The name of the Cloud Run service"
  type        = string
  default     = "novu-web"
}

variable "web_image" {
  description = "The fully qualified image URL to deploy from Artifact Registry"
  type        = string
  default     = "novu-web"
}

variable "web_port" {
  description = "The port to expose on the Cloud Run service"
  type        = number
  default     = 4200
}

## Artifact Registry

variable "repository_id" {
  description = "The id of the Artifact Registry repository"
  type        = string
}

variable "repository_project_id" {
  description = "The project id of the Artifact Registry repository"
  type        = string
}

## VPC
variable "vpc_connector" {
  description = "The name of the serverless VPC Access connector"
  type        = string
}

variable "vpc_network" {
  description = "The name of the VPC network"
  type        = string
}
