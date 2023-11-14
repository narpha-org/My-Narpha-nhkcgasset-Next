docker-compose -f docker-compose.yml --env-file ./.env.development --env-file ./.env.development.aws --env-file ./.env.development.okta build
docker-compose -f docker-compose.yml --env-file ./.env.development --env-file ./.env.development.aws --env-file ./.env.development.okta up -d --remove-orphans
docker-compose -f docker-compose.yml ps
