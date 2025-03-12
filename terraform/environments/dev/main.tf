## Components images

data "google_artifact_registry_docker_image" "novu_worker" {
  location      = var.region
  repository_id = var.repository_id
  project       = var.repository_project_id
  image_name    = var.worker_image
}

data "google_artifact_registry_docker_image" "novu_ws" {
  location      = var.region
  repository_id = var.repository_id
  project       = var.repository_project_id
  image_name    = var.ws_image
}

data "google_artifact_registry_docker_image" "novu_api" {
  location      = var.region
  repository_id = var.repository_id
  project       = var.repository_project_id
  image_name    = var.api_image
}

data "google_artifact_registry_docker_image" "novu_web" {
  location      = var.region
  repository_id = var.repository_id
  project       = var.repository_project_id
  image_name    = var.web_image
}

## Redis

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

## Secrets

module "secrets" {
  source                         = "../../modules/secrets"
  project_id                     = var.project_id
  mongodb_url_secret_id          = "novu-mongodb-url"
  mongodb_url                    = var.mongodb_url
  redis_host_secret_id           = "novu-redis-host"
  redis_host                     = module.redis.redis_host
  redis_password_secret_id       = "novu-redis-password"
  redis_password                 = module.redis.redis_auth_string
  store_encryption_key_secret_id = "novu-store-encryption-key"
  store_encryption_key           = var.store_encryption_key
  jwt_secret_secret_id           = "novu-jwt-secret"
  jwt_secret                     = var.jwt_secret
  novu_secret_key_secret_id      = "novu-secret-key"
  novu_secret_key                = var.novu_secret_key
}

## Service Account

module "service_account" {
  source     = "../../modules/service_account"
  project_id = var.project_id
  account_id = "novu-cloudrun-sa"
}

resource "google_secret_manager_secret_iam_member" "redis_host_accessor" {
  secret_id = module.secrets.redis_host_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${module.service_account.novu_cloudrun_sa_email}"
}

resource "google_secret_manager_secret_iam_member" "redis_password_accessor" {
  secret_id = module.secrets.redis_password_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${module.service_account.novu_cloudrun_sa_email}"
}

resource "google_secret_manager_secret_iam_member" "mongodb_url_accessor" {
  secret_id = module.secrets.mongodb_url_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${module.service_account.novu_cloudrun_sa_email}"
}

resource "google_secret_manager_secret_iam_member" "store_encryption_key_accessor" {
  secret_id = module.secrets.store_encryption_key_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${module.service_account.novu_cloudrun_sa_email}"
}

resource "google_secret_manager_secret_iam_member" "jwt_secret_accessor" {
  secret_id = module.secrets.jwt_secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${module.service_account.novu_cloudrun_sa_email}"
}

resource "google_secret_manager_secret_iam_member" "novu_secret_key_accessor" {
  secret_id = module.secrets.novu_secret_key_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${module.service_account.novu_cloudrun_sa_email}"
}

## Worker

module "worker" {
  source                        = "../../modules/worker"
  project_id                    = var.project_id
  region                        = var.region
  worker_service_name           = var.worker_service_name
  worker_image                  = data.google_artifact_registry_docker_image.novu_worker.self_link
  mongodb_url                   = module.secrets.mongodb_url
  redis_url                     = module.secrets.redis_host
  redis_password                = module.secrets.redis_password
  store_encryption_key          = module.secrets.store_encryption_key
  novu_cloudrun_service_account = module.service_account.novu_cloudrun_sa_email
  vpc_connector                 = var.vpc_connector
}

## WS

module "ws" {
  source                        = "../../modules/ws"
  project_id                    = var.project_id
  region                        = var.region
  ws_service_name               = var.ws_service_name
  ws_image                      = data.google_artifact_registry_docker_image.novu_ws.self_link
  mongodb_url                   = module.secrets.mongodb_url
  redis_url                     = module.secrets.redis_host
  redis_password                = module.secrets.redis_password
  jwt_secret                    = module.secrets.jwt_secret
  novu_cloudrun_service_account = module.service_account.novu_cloudrun_sa_email
  vpc_connector                 = var.vpc_connector
}

## API

module "api" {
  source           = "../../modules/api"
  project_id       = var.project_id
  region           = var.region
  api_service_name = var.api_service_name
  api_image        = data.google_artifact_registry_docker_image.novu_api.self_link
  mongodb_url      = module.secrets.mongodb_url
  redis_url        = module.secrets.redis_host
  redis_password   = module.secrets.redis_password
  # store_encryption_key          = module.secrets.store_encryption_key
  jwt_secret                    = module.secrets.jwt_secret
  novu_secret_key               = module.secrets.novu_secret_key
  novu_cloudrun_service_account = module.service_account.novu_cloudrun_sa_email
  vpc_connector                 = var.vpc_connector
  vpc_network                   = var.vpc_network
}

## Web

module "web" {
  source                = "../../modules/web"
  project_id            = var.project_id
  region                = var.region
  web_service_name      = var.web_service_name
  web_image             = data.google_artifact_registry_docker_image.novu_web.self_link
  react_app_api_url     = module.api.api_service_url
  react_app_ws_url      = module.ws.ws_service_url
  react_app_environment = var.node_env
  vpc_connector         = var.vpc_connector
}
