resource "mongodbatlas_advanced_cluster" "novu_cluster" {
  project_id     = var.atlas_project_id
  name           = var.cluster_name
  cluster_type   = "REPLICASET"
  backup_enabled = (var.provider_name == "TENANT") ? null : true

  replication_specs = [{
    region_configs = [{
      priority      = 7
      provider_name = var.provider_name
      backing_provider_name = (var.provider_name == "TENANT" && var.instance_size == "M0") ? var.backing_provider_name : null
      region_name   = var.atlas_region
      electable_specs = {
        instance_size = var.instance_size
        node_count    = (var.provider_name == "TENANT") ? null : 3
      }
      # auto_scaling = {
      #   compute_enabled            = true
      #   compute_scale_down_enabled = true
      #   compute_min_instance_size  = var.instance_size
      #   compute_max_instance_size  = var.max_instance_size
      #   disk_gb_enabled            = true
      # }
    }]
  }]
  tags = {
    environment = var.environment
  }

  lifecycle {
    ignore_changes = [
      replication_specs[0].region_configs[0].electable_specs.instance_size,
    ]
  }
}

# Database user
resource "mongodbatlas_database_user" "novu_db_user" {
  project_id         = var.atlas_project_id
  username           = var.db_username
  password           = var.db_password
  auth_database_name = "admin" # Authenticate against the admin database

  roles {
    role_name     = "readWriteAnyDatabase"
    database_name = "admin"
  }

  labels {
    key   = "owner"
    value = "terraform"
  }
}
