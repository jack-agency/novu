## Create the Cloud Run service for the Novu Dashboard app.

resource "google_cloud_run_v2_service" "novu_dashboard" {
  name                = "novu-dashboard"
  location            = var.region
  project             = var.project_id
  deletion_protection = false
  ingress             = "INGRESS_TRAFFIC_ALL"
  launch_stage        = "BETA"
  # iap_enabled        = true # Not yet supported in terraform provider
  template {

    containers {
      image = var.dashboard_image
      ports {
        container_port = var.dashboard_port
      }

      env {
        name  = "VITE_API_HOSTNAME"
        value = var.vite_api_hostname
      }

      env {
        name  = "VITE_LEGACY_DASHBOARD_URL"
        value = var.vite_legacy_dashboard_url
      }

      env {
        name  = "VITE_SELF_HOSTED"
        value = "true"
      }

      env {
        name  = "VITE_WEBSOCKET_HOSTNAME"
        value = var.vite_websocket_hostname
      }
    }

    vpc_access {
      connector = var.vpc_connector
      egress    = "ALL_TRAFFIC"
    }
  }
}
