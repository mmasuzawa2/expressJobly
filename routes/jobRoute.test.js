"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,u2Token,testJobIds
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST */


describe("create job", function () {
  const newJob = {
        title: "job title",
        salary: 100000,
        equity:"0",
        companyHandle:"c1"
  };

  test("ok for admin", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send(newJob)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      jobs: {
        ...newJob,
        id:expect.any(Number),
        }
    });
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send({
            title: "job title",
            salary: 100000,
            equity:"0"
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
        .post("/companies")
        .send({
          ...newJob,
          logoUrl: "not-a-url",
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET */

describe("GET job", function () {
  test("ok for anon", async function () {
    const resp = await request(app).get("/jobs");
    expect(resp.body).toEqual({
      jobs:
          [
            {
                id:expect.any(Number),
                title: "test title",
                salary: 10000,
                equity:"0",
                companyHandle:"c1"
              },
              {
                id:expect.any(Number),
                title: "test title2",
                salary: 15000,
                equity:"0.4",
                companyHandle:"c2"
              },
              {
                id:expect.any(Number),
                title: "test title3",
                salary: 20000,
                equity: null,
                companyHandle:"c3"
              }
          ],
    });
  });
  


});


/************************************** PATCH  */

describe("update job", function () {
  test("works for admin", async function () {
    const resp = await request(app)
        .patch(`/jobs/${testJobIds[0]}`)
        .send({
          title: "C1-new",
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.body).toEqual({
      job: { 
            id: testJobIds[0],
            title: "C1-new",
            salary: 10000,
            equity:"0",
            companyHandle:"c1"
      },
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .patch(`/jobs/${testJobIds[0]}`)
        .send({
          title: "C1-new",
        });
    expect(resp.statusCode).toEqual(401);
  });

});

/************************************** DELETE */

describe("DELETE job", function () {
  test("works for admin", async function () {
    const resp = await request(app)
        .delete(`/jobs/${testJobIds[0]}`)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.body).toEqual({ deleted: `${testJobIds[0]}` });
  });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//         .delete(`/companies/c1`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("not found for no such company", async function () {
//     const resp = await request(app)
//         .delete(`/companies/nope`)
//         .set("authorization", `Bearer ${u2Token}`);
//     expect(resp.statusCode).toEqual(404);
//   });
});
