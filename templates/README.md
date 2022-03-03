# $APP_NAME

### Setup and run

1. Download and install nodejs (preffer stable)
2. Download and install docker and docker-compose
3. Run `sudo docker-compose up -d`

### Daily work

- Any code changes made to the **src** folder are instantly reflected in the container
- Changes made to the **.env** file needs to  be manually applied (just save any ts file)
- Changes made to the **package.json** file only will applied after run `sudo docker-compose up --build -d -V`

### Debug

Once the containers are initialized, just run the **Debug (docker)** option in VS Code

### Logs

```sh
$ sudo docker logs $APP_NAME -f
```

### Testing

```sh
$ npm test
```

### Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.