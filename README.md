## Setup

### In order to run this program, you need to have the following set up on your local machine.

1. postgres server
2. redis server

### create a local database
```sh
createdb <my-database-name>
```

this needs to match your ormconfig.json

```json
{
    ...
    "database": <my-database-name>,
    "synchronize": true,
    "logging": true,
    "entities": ["src/entity/*.*"]
}
```

### create a .env file
