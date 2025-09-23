# Already exists once a peering have been made while creating a cluster in the same Atlas project.
# resource "mongodbatlas_network_container" "novu_container" {
#   project_id       = var.atlas_project_id
#   atlas_cidr_block = var.atlas_cidr_block
#   provider_name    = "GCP"
# }

# Peering connection request
resource "mongodbatlas_network_peering" "gcp_peering" {
  project_id       = var.atlas_project_id
  container_id     = one(values(mongodbatlas_advanced_cluster.novu_cluster.replication_specs[0].container_id))
  provider_name    = "GCP"
  network_name     = var.gcp_vpc_name
  atlas_cidr_block = var.atlas_cidr_block
  gcp_project_id   = var.gcp_project_id
}

# GCP VPC
data "google_compute_network" "lucius_vpc" {
  project = var.gcp_project_id
  name    = var.gcp_vpc_name
}

# GCP Peer
resource "google_compute_network_peering" "gcp_peer" {
  name         = "gcp-peer-${var.cluster_name}"
  network     = data.google_compute_network.lucius_vpc.self_link
  peer_network = "https://www.googleapis.com/compute/v1/projects/${mongodbatlas_network_peering.gcp_peering.atlas_gcp_project_id}/global/networks/${mongodbatlas_network_peering.gcp_peering.atlas_vpc_name}"
}

# IP Access List
resource "mongodbatlas_project_ip_access_list" "ip_access_list_gcp" {
  project_id = var.atlas_project_id
  cidr_block = var.gcp_cidr_block
  comment    = "GCP VPC Access"
}

resource "mongodbatlas_project_ip_access_list" "ip_access_list_gcp_serverless_connector" {
  project_id = var.atlas_project_id
  cidr_block = var.serverless_connector_cidr_block
  comment    = "GCP Serverless VPC Access Connector Subnet"
}
