Install

Clone project
1. `npm install`
2. Connect Heroku remote: `heroku git:remote -a powerful-atoll-48426`
3. Create a file at the root level called `.env`
4. In the terminal, run `heroku config` to see all env vars
5. In .env, add AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, JWT_SECRET, and S3_BUCKET_NAME. Local mongo will be used.

Develop

1. `gulp distribute-watch` to compile while working.
2. `nodemon` to run app on localhost:3000
3. `mongod` to run test db


Deploy
1. `gulp` create distributable
2. `git push heroku master` push to https://powerful-atoll-48426.herokuapp.com/
