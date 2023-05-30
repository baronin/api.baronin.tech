up:
	docker-compose up -d
	docker-compose ps
upbuild:
	docker-compose up -d --build
	docker-compose ps
ps:
	docker-compose ps
psa:
	docker-compose ps -a
down:
	docker-compose down --remove-orphans
cli:
	docker exec -ti db_auth bash
