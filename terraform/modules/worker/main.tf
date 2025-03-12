resource "google_cloud_run_v2_service" "novu_worker" {
  name                = var.worker_service_name
  location            = var.region
  project             = var.project_id
  deletion_protection = false
  ingress             = "INGRESS_TRAFFIC_INTERNAL_ONLY"
  template {

    service_account = var.novu_cloudrun_service_account

    containers {
      image = var.worker_image

      env {
        name  = "NODE_ENV"
        value = var.node_env
      }

      env {
        name = "MONGO_URL"
        value_source {
          secret_key_ref {
            secret  = var.mongodb_url
            version = "latest"
          }
        }
      }

      env {
        name  = "MONGO_MAX_POOL_SIZE"
        value = var.mongo_max_pool_size
      }

      env {
        name = "REDIS_HOST"
        value_source {
          secret_key_ref {
            secret  = var.redis_url
            version = "latest"
          }
        }
      }

      env {
        name  = "REDIS_PORT"
        value = var.redis_port
      }

      env {
        name = "REDIS_PASSWORD"
        value_source {
          secret_key_ref {
            secret  = var.redis_password
            version = "latest"
          }
        }
      }

      env {
        name  = "REDIS_DB_INDEX"
        value = 2
      }

      env {
        name = "REDIS_CACHE_SERVICE_HOST"
        value_source {
          secret_key_ref {
            secret  = var.redis_url
            version = "latest"
          }
        }
      }

      env {
        name  = "REDIS_CACHE_SERVICE_PORT"
        value = var.redis_port
      }

      env {
        name  = "BROADCAST_QUEUE_CHUNK_SIZE"
        value = 100
      }

      env {
        name  = "MULTICAST_QUEUE_CHUNK_SIZE"
        value = 100
      }

      env {
        name  = "SUBSCRIBER_WIDGET_JWT_EXPIRATION_TIME"
        value = "15 days"
      }

      env {
        name = "STORE_ENCRYPTION_KEY"
        value_source {
          secret_key_ref {
            secret  = var.store_encryption_key
            version = "latest"
          }
        }
      }
    }

    containers {
      image = "hashicorp/http-echo:0.2.3"
      name  = "output-worker-health-proxy"
      args  = ["-text=OK", "-listen=:${var.novu_worker_container_port}"]

      ports {
        container_port = var.novu_worker_container_port
      }
    }

    vpc_access {
      connector = var.vpc_connector
      egress    = "ALL_TRAFFIC"
    }
  }

  depends_on = [var.novu_cloudrun_service_account, var.mongodb_url, var.redis_url]
}
