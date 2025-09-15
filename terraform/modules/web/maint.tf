## Create the Cloud Run service for the Novu Web app.

resource "google_cloud_run_v2_service" "novu_web" {
  name                = "novu-web"
  location            = var.region
  project             = var.project_id
  deletion_protection = false
  ingress             = "INGRESS_TRAFFIC_ALL"
  template {

    containers {
      image = var.web_image
      ports {
        container_port = var.web_port
      }

      env {
        name  = "REACT_APP_API_URL"
        value = var.react_app_api_url
      }

      env {
        name  = "REACT_APP_IS_SELF_HOSTED"
        value = "true"
      }

      env {
        name  = "REACT_APP_WS_URL"
        value = var.react_app_ws_url
      }

      env {
        name  = "NODE_ENV"
        value = var.node_env
      }

      env {
        name  = "REACT_APP_WIDGET_EMBED_PATH"
        value = "https://eu.embed.novu.co/embed.umd.min.js"
      }
    }

    vpc_access {
      connector = var.vpc_connector
      egress    = "ALL_TRAFFIC"
    }
  }
}
