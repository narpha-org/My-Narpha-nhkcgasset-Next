docker-compose -f docker-compose.prod.yml --env-file ./.env.production build
docker-compose -f docker-compose.prod.yml --env-file ./.env.production up -d --remove-orphans
docker-compose -f docker-compose.prod.yml ps
