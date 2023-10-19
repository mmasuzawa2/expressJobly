"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for companies. */

class Jobs { 
  /** Create jobs
   * 
   * Returns { handle, name, description, numEmployees, logoUrl }
   *
   * Throws BadRequestError if company already in database.
   * */

  static async create(data ) {

    const result = await db.query(
          `INSERT INTO jobs
           (title, salary, equity, company_handle)
           VALUES ($1, $2, $3, $4)
           RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
        [
          data.title,
          data.salary,
          data.equity, 
          data.companyHandle
        ],
    );
    const job = result.rows[0];

    return job;
  }


   /** Find job from id
   *
   * */

  static async get(id) {
    const jobRes = await db.query(
          `SELECT id,
                  title,
                  salary,
                  equity,
                  company_handle AS "companyHandle"
           FROM jobs
           WHERE id = $1`, [id]);

    const job = jobRes.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);
    
    return job;

  }


  /** Filter or find all jobs 
   *
   * */

  static async filterBy(filterBy) {
    let whereClause="";
    if(!filterBy){
      } else{
          const {title,minSalary,equity} = filterBy;

          if(title && minSalary===undefined && equity===undefined){
            whereClause = ` WHERE title LIKE '%${title}%' `
          }
          if(title===undefined && minSalary && equity===undefined){
            whereClause = ` WHERE salary >= ${minSalary} `
          }
          if(title===undefined && minSalary===undefined && equity){
            whereClause = ` WHERE equity > 0 `
          }
          if(title && minSalary && equity===undefined){
            whereClause = ` WHERE title LIKE '%${title}%' AND  salary >= ${minSalary} `
          }
          if(title===undefined && minSalary && equity){
            whereClause = ` WHERE salary >= ${minSalary} AND equity > 0 `
          }
          if(title && minSalary===undefined && equity){
            whereClause = ` WHERE title LIKE '%${title}%' AND equity > 0 `
          }
        }

    const jobRes = await db.query(
          `SELECT id, title, salary, equity, company_handle AS "companyHandle"
           FROM jobs
           ${whereClause}
           ORDER BY id`);
    
    return jobRes.rows;
  }





  /** Update job
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,{});
    const idx = "$" + (values.length + 1);

    const querySql = `UPDATE jobs 
                      SET ${setCols} 
                      WHERE id = ${idx} 
                      RETURNING id, title, salary, equity, company_handle AS "companyHandle"`;
    const result = await db.query(querySql, [...values, id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);

    return job;
  }



  /** Delete given company from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM jobs
           WHERE id = $1
           RETURNING id`,
        [id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job with id: ${id}`);
  }
  




}



module.exports = Jobs;

