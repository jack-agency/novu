output "connection_string" {
  # value = mongodbatlas_advanced_cluster.novu_cluster.connection_strings.private_srv
  value = "mongodb+srv://${var.db_username}:${var.db_password}@${replace(mongodbatlas_advanced_cluster.novu_cluster.connection_strings.private_srv, "mongodb+srv://", "")}"
  sensitive = true
}
