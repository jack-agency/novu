variable "atlas_project_id" {
  description = "Atlas project ID where the cluster and networking resources will be created."
  type        = string
}

variable "gcp_project_id" {
  description = "GCP project id that owns the VPC you want to peer with."
  type        = string
}

variable "cluster_name" {
  description = "Name for the Atlas cluster"
  type        = string
  default     = "novu"
}

variable "mongo_version" {
  description = "MongoDB major/minor version"
  type        = string
  default     = "8.0.13"
}

variable "provider_name" {
  description = "Cloud provider for the Atlas cluster"
  type        = string
  default     = "GCP"
}

variable "backing_provider_name" {
  description = "Backing cloud provider for the Atlas cluster"
  type        = string
}

variable "network_container_id" {
  description = "ID of an existing Atlas network container (VPC) to use for peering. If not provided, a new container will be created using the provided atlas_cidr_block."
  type        = string
}

variable "atlas_region" {
  description = "Provider region (Atlas region name), e.g. europe-west1 for Belgium"
  type        = string
  default     = "WESTERN_EUROPE"
  
}

variable "instance_size" {
  description = "Atlas instance size (cluster tier), e.g. M10"
  type        = string
}

variable "atlas_cidr_block" {
  description = "CIDR block that Atlas will use for its VPC/container for peering (e.g. 192.168.240.0/22). Required when creating peering if no Atlas container exists."
  type        = string
}

variable "gcp_cidr_block" {
  description = "CIDR block of the GCP VPC you want to peer with"
  type        = string
}

variable "serverless_connector_cidr_block" {
  description = "CIDR block of the GCP Serverless VPC Access Connector subnet (e.g. 10.7.0.0/28)."
  type        = string
}

variable "gcp_vpc_name" {
  description = "Name of the GCP VPC network to peer with."
  type        = string
}

variable "db_username" {
  description = "The username for the database user."
  type        = string
  default     = "novu"
}

variable "db_password" {
  description = "The password for the database user."
  type        = string
  sensitive   = true # Mark as sensitive to prevent it from being shown in logs
}

variable "environment" {
  description = "Environment tag to apply to resources (e.g. dev, staging, prod)"
  type        = string 
}

variable "public_key" {
  description = "MongoDB Atlas Public Key"
  type        = string
}

variable "private_key" {
  description = "MongoDB Atlas Private Key"
  type        = string
  sensitive   = true
}
