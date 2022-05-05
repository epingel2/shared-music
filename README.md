# shared-music
**Shared Music** service provides you rooms where you can listen to music with friends or anyone else who wants to come in. All you have to do is click create room button and share the link. It's that simple! See all the features below.

**Main goals:**
- Provide a useful service which will allow anyone listen to music, share it and play at the same time
- Construct WebSocket-based application
- Gain team work experience

Live version can be visited at: [sharedmusic.live](https://sharedmusic.live/)


[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)


## Table of contents

- [shared-music](#shared-music)
  - [Table of contents](#table-of-contents)
  - [Requirements (Prerequisites)](#requirements-prerequisites)
  - [Installation](#installation)
    - [Docker setup](#docker-setup)
    - [Local setup (without Docker containers)](#local-setup-without-docker-containers)
  - [Screenshots](#screenshots)
  - [Features](#features)
    - [Main features](#main-features)
    - [Tech features](#tech-features)
    - [Room owner features:](#room-owner-features)
  - [Usage](#usage)
    - [Run project](#run-project)
    - [Linters](#linters)
    - [Fixtures](#fixtures)
  - [Tests](#tests)
    - [Tests description](#tests-description)
  - [Deployment](#deployment)
  - [Tech stack](#tech-stack)
  - [Authors](#authors)


## Requirements (Prerequisites)

- Python v3.9 [Install](https://www.python.org/downloads/release/python-390/)
- Docker [Install](https://www.docker.com/products/docker-desktop)
- Git [Install](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)


## Installation

- Clone repository:
```
git clone https://github.com/Lomank123/shared-music.git
```

- Go to project root folder, create `.env` file and copy the contents of `.env.sample` to it.

For Linux:
```
cd path/to/project/shared-music
cp .env.sample .env
```

### Docker setup

- Build everything:
```
docker-compose build
``` 

For the first time it may take 5-20 minutes to build everything (depends on your internet connection and PC hardware)


### Local setup (without Docker containers)

- First of all you have to install Redis server. [Here](https://redis.io/docs/getting-started/) you can find related information.

- After that, open `settings.py` and find `CHANNEL_LAYERS` variable. Use method 2 as described in the comments and replace
```
"hosts": [('redis', 6379)],
```
with
```
"hosts": [('127.0.0.1', 6379)], OR "hosts": [(REDIS_HOST, 6379)],
```

- Next is `venv` setup:
```
mkdir venv
cd venv
py -m venv ./venv
```

- Install requirements:
```
pip install -r requirements.txt
```

- Create Postgres db and user (credentials should be the same as in `.env` file)

- Also change `DB_HOST` env var in `.env` file from `'db'` to `'localhost'`:
```
DB_HOST=localhost
```

- Go to `/sharedmusic` dir:
```
cd sharedmusic
```

-  Migrations:
```
py manage.py makemigrations
py manage.py migrate
```

- Create superuser:
```
py manage.py createsuperuser
```


## Screenshots

Insert some screenshots


## Features

### Main features
- Create room in one click
- Invite anyone by sharing the link
- Load tracks from YouTube (other services WIP)
- User playlist (WIP)
- Save/Load room playlist (WIP)
- Download urls from room or user playlist (WIP)
- Communicate by sending messages to in-room chat (WIP)
    - Private messages included

### Tech features
- Both asgi and wsgi apps (daphne and gunicorn) to serve `http` and `WebSocket` connections.
- WebSocket protocol to keep changes in rooms
- Celery tasks
    -  To remove abandoned rooms (periodically)
- CI/CD with the help of GitHub Actions (tests and linter) (WIP)
- Nginx reverse proxy to serve static files and WebSockets

### Room owner features:
- Set permissions to limit some actions (WIP)
    - Who can change track
    - Who can vote for change
    - Enable/Disable vote for change
- Ban, kick or mute listeners if it is needed (WIP)
- Transfer ownership to any listener (WIP)


## Usage

### Run project

- Locally:
```
cd sharedmusic
py manage.py runserver
```

- Using Docker:
```
docker-compose up
```

### Linters
- To run linters:

### Fixtures
- To fill the database:

- Superuser:
    - email: `admin@gmail.com`
    - password: `12345`
- User 1:
    - email: `test1@gmail.com`
    - password: `123123123Aa`
- User 2:
    - email: `test2@gmail.com`
    - password: `123123123Qq`


## Tests

- To run tests:


### Tests description


## Deployment

Assuming remote host OS is Linux, and Docker, docker-compose and Git have been installed recently:

- Enter remote host's console via ssh:
```
ssh -l username ip-address 
```
Fill in password after this command.

- Follow [installation](#installation) guide

- To run production version you should use:
```
docker-compose -f docker-compose-deploy.yml up
```


## Tech stack

- **Backend**:
    - Django 3
    - channels
    - Redis
    - Gunicorn
    - Daphne
    - PostgreSQL
    - Coverage
    - Celery
    - Nginx
- **Frontend**:
    - YouTube API
    - jQuery
- **Other**:
    - GitHub
    - Codecov
    - Docker
    - docker-compose


## Authors

- [Lomank123](https://github.com/Lomank123)
- [erikgab01](https://github.com/erikgab01)