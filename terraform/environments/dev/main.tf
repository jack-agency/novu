module "redis" {
  source         = "../../modules/redis"
  project_id     = var.project_id
  region         = var.region
  location_id    = var.location_id
  instance_name  = "novu-redis-instance"
  tier           = "BASIC"
  memory_size_gb = 1
  redis_version  = var.redis_version
  vpc_network    = var.vpc_network
}
