"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn,verifyAdmin } = require("../middleware/auth");
const Job = require("../models/jobs");

const jobNewSchema = require("../schemas/jobNew.json");
const jobUpdateSchema = require("../schemas/jobUpdate.json");

const router = new express.Router();





router.get("/", async function (req, res, next) {
  try {
    const jobs = await Job.filterBy(req.body);
    return res.json({ jobs });
  } catch (err) {
    return next(err);
  }
});



router.post("/", [ensureLoggedIn,verifyAdmin], async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, jobNewSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
  
      const jobs = await Job.create(req.body);
      return res.status(201).json({ jobs });
    } catch (err) {
      return next(err);
    }
  });


router.patch("/:id", [ensureLoggedIn,verifyAdmin], async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, jobUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const job = await Job.update(req.params.id, req.body);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});


router.delete("/:id", [ensureLoggedIn,verifyAdmin], async function (req, res, next) {
  try {
    await Job.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
