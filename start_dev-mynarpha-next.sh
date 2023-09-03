docker-compose -f docker-compose.yml --env-file ./.env.development build
docker-compose -f docker-compose.yml --env-file ./.env.development up -d --remove-orphans
docker-compose -f docker-compose.yml ps
