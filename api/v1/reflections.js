const express = require("express");
const router = express.Router();
const uuidv4 = require("uuid/v4");
const db = require("../../db/index");
const { GET, SET, GET_ALL, DELETE } = require("../../constants");

/**
 * Create A Reflection
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
router.post("", async (req, res) => {
  const operation = SET;
  const values = {
    _id: uuidv4(),
    success: "" + req.body.success,
    low_point: "" + req.body.low_point,
    take_away: "" + req.body.take_away,
    created_date: new Date(),
    modified_date: new Date()
  };

  try {
    const datas = await db.query(operation, values);
    return res.status(201).json(datas);
  } catch (error) {
    return res.status(400).json({ error });
  }
});
/**
 * Get A Reflection
 * @param {object} req
 * @param {object} res
 * @returns {object} reflections array
 */
router.get("/:id", async (req, res) => {
  const operation = GET;
  try {
    const datas = await db.query(operation, { _id: req.params.id });
    if (!datas) {
      return res.status(404).json({ message: "reflection not found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

/**
 * Get All Reflection
 * @param {object} req
 * @param {object} res
 * @returns {object} reflections array
 */
router.get("", async (req, res) => {
  const operation = GET_ALL;
  try {
    const datas = await db.query(operation);
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

/**
 * Update A Reflection
 * @param {object} req
 * @param {object} res
 * @returns {object} updated reflection
 */
router.put("/:id", async (req, res) => {
  const preOperation = GET;
  try {
    const datas = await db.query(preOperation, { _id: req.params.id });
    if (!datas) {
      return res.status(404).json({ message: "reflection not found" });
    }

    const values = {
      success: req.body.success || datas.success,
      low_point: req.body.low_point || datas.low_point,
      take_away: req.body.take_away || datas.take_away,
      modified_date: new Date(),
      _id: req.params.id
    };

    //redis set can update
    const operation = SET;
    const response = await db.query(operation, values);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ error });
  }
});
/**
 * Delete A Reflection
 * @param {object} req
 * @param {object} res
 * @returns {void} return statuc code 204
 */
router.delete("/:id", async (req, res) => {
  const operation = DELETE;
  try {
    const datas = await db.query(operation, { _id: req.params.id });
    if (!datas) {
      return res.status(404).json({ message: "reflection not found" });
    }
    return res.status(204).json({ message: "deleted" });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;

/*
HTTP Status Code 204: 
The server has successfully fulfilled the request and that there is no additional
content to send in the response payload body.
*/
