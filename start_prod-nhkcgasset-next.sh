docker-compose -f docker-compose.prod.yml --env-file ./.env.production --env-file ./.env.production.aws --env-file ./.env.production.okta build
docker-compose -f docker-compose.prod.yml --env-file ./.env.production --env-file ./.env.production.aws --env-file ./.env.production.okta up -d --remove-orphans
docker-compose -f docker-compose.prod.yml ps
