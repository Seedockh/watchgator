# WatchGator
Startup week project : Movies / Series search engine

# Heroku Deploys

All commands are inspired from [this article](https://medium.com/@shalandy/deploy-git-subdirectory-to-heroku-ea05e95fce1f).

## Setup

First, make sure to get the **``Heroku Cli`**
```console
~ $ npm install -g heroku
~ $ heroku login
```

## Client

You can run either :
```console
~/watchgator$ yarn pcli
```

Or :
```console
~/watchgator$ heroku git:remote -a watchgator-client
~/watchgator$ git subtree push --prefix client heroku master
```

## Server

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
