resource "google_redis_instance" "novu_redis" {
  name           = var.instance_name
  project        = var.project_id
  region         = var.region
  location_id    = var.location_id
  tier           = var.tier
  memory_size_gb = var.memory_size_gb
  redis_version  = var.redis_version


  authorized_network = "projects/${var.project_id}/global/networks/${var.vpc_network}"
  connect_mode       = "PRIVATE_SERVICE_ACCESS"


  auth_enabled = true

}
