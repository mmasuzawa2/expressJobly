"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Jobs = require("./jobs.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create(POST) */

describe("create job", function () {
  let newJob = {
    companyHandle: "c1",
    title: "Test",
    salary: 100,
    equity: "0.1",
  };

  test("works", async function () {
    let job = await Jobs.create(newJob);
    expect(job).toEqual({
      ...newJob,
      id: expect.any(Number)
  });
  });
});

/************************************** find(GET) */

describe("find job", function () {
  test("works: no filter", async function () {
    let jobs = await Jobs.filterBy();
    expect(jobs).toEqual([
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
    ]);
  });

  test("filter by title and min salary", async function () {
    let jobs = await Jobs.filterBy({title:"test",minSalary:14000});
    expect(jobs).toEqual([
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
          equity:null,
          companyHandle:"c3"
        }
    ]);
  });

});


/************************************** update */

describe("update", function () {
  const updateData = {
    title: "updated title3",
    salary: 30000,
    equity:"0.2",
  };

  test("works", async function () {
    console.log(testJobIds);
    let job = await Jobs.update(testJobIds[2], updateData);
    expect(job).toEqual({
      id: testJobIds[2],
      companyHandle: "c3",
      ...updateData,
    });

  });


});

/************************************** remove */

describe("remove", function () {
  test("remove by id", async function () {
    const id = await Jobs.remove(testJobIds[0]);
    expect(id).toEqual(testJobIds[0]);
    const res = await db.query(
        "SELECT company_handle FROM jobs WHERE company_handle='c1'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Jobs.remove(111111);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
