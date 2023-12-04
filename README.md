# expressJobly

This is a Job look-up application where user may register/log in to look up jobs and apply to them.
Admin are allowed with full CRUD for jobs,companies,and users info. 

Tokens are created and verified by using JWT module.

This is a backend only API app that takes query string requests or JSON body, to which returns JSON data. 

To run the app, execute:
Node server.js

For testing, run:
jest -i

You may run jobly.sql to set up the database. 


helpers:
  tokens.js (creates JWT token)
  sql.js (helper to convert js value to sql column name and accepts partial updates. Returns SET string and values to update with)

middleware:
  auth.js (verifies JWT, verifies if user is logged in, verify if user is admin)

models:
  company.js (Model for comopany ORM)
  jobs.js (Model for jobs ORM)
  user.js (Model for user ORM)

routes:
  auth.js (login and register)
  companies.js (company CRUD)
  jobRoute.js (jobs CRUD)
  users.js (users CRUD)
  
