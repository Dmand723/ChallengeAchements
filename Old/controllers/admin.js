const { mongo } = require("mongoose");
const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;
const challenge = require("../models/challenge");

const createChalenge = async (req, res) => {
  try {
    const challenge = {
      title: req.body.title,
      desc: req.body.desc,
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection("challenges")
      .insertOne(challenge);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res
        .status(500)
        .json(
          response.error || "Some error occurred while creating the challenge."
        );
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateChallenge = async (req, res) => {
  try {
    const challengeId = new ObjectId(req.params.id);
    // const challenge = {
    //   title: req.body.title,
    //   desc: req.body.desc,

    // };
    const challenge = req.body;

    const response = await mongodb
      .getDb()
      .db()
      .collection("challenges")
      .replaceOne({ _id: challengeId }, challenge);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res
        .status(500)
        .json(
          response.error || "Some error occurred while updating the challenge."
        );
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const getAllChallenges = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection("challenges").find();
    result.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists);
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteChallenge = async (req, res) => {
  try {
    const challengeId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db()
      .collection("challenges")
      .deleteOne({ _id: challengeId }, true);
    console.log(response);
    if (response.acknowledged) {
      res.status(200).send(response);
    } else {
      res
        .status(500)
        .json(
          response.error || "Some error occurred while deleting the challenge."
        );
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createChalenge,
  updateChallenge,
  getAllChallenges,
  deleteChallenge,
};
