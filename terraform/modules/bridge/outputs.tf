output "bridge_service_url" {
  description = "The URL at which the Cloud Run service is accessible"
  value       = google_cloud_run_v2_service.novu_bridge.urls[0]
}
