# Matcha

## Getting Started

To start PostgreSQL server, run the following command in your terminal window

```
pg_ctl -D /Users/grevenko/.brew/var/postgres start
```

To initiate the project, cd to the root directory and run

```
npm init && npm i express && npm i pg-promise && npm i client-sessions && npm i pg-format && npm i express-validator && npm i random-hash && npm i sendmail && npm i socket.io && npm i bcrypt
```

To initiate the database, run

```
node server/db.js
```

To start Node.js server, run

```
node server/server.js
```

Now Matcha website is available at [http://localhost:5000](http://localhost:5000)
