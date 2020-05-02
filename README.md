# WatchGator
Startup week project : Movies / Series search engine

# Hosted URLs

- Client: http://www.watchgator.org
- Server: https://watchgator-server.herokuapp.com/

# API

### Documentation

https://watchgator-server.herokuapp.com/doc/  

# Heroku Deploys

All commands are inspired from [this article](https://medium.com/@shalandy/deploy-git-subdirectory-to-heroku-ea05e95fce1f).

## Setup

First, make sure to get the **`Heroku Cli`**
```console
~ $ npm install -g heroku
~ $ heroku login
```

## Deploy Client

You can run either :
```console
~/watchgator$ yarn pcli
```

Or :
```console
~/watchgator$ heroku git:remote -a watchgator-client
~/watchgator$ git subtree push --prefix client heroku master
```

## Deploy Server

You can run either :
```console
~/watchgator$ yarn pserv
```

Or :
```console
~/watchgator$ heroku git:remote -a watchgator-server
~/watchgator$ git subtree push --prefix server heroku master
```

## Both

```console
~/watchgator$ yarn pheroku
```
