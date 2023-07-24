const asyncHandler = require("express-async-handler");
const reactCookie = require("react-cookies");
const postModel = require("../models/postModel");
class blogController {
  static userPostData = asyncHandler(async (req, res) => {
    const Token = reactCookie.load("token");
    if (Token) {
      const { _id } = req.user;
      const { post, tag } = req.body.data;
      if (post && tag) {
        await postModel.create({
          creatorId: _id,
          post,
          tag,
        });

        res
          .status(201)
          .json({ message: "Post create successfully.", status: "success" });
      } else {
        res.status(400);
        throw new Error("All fields are required.");
      }
    } else {
      res.status(400);
      throw new Error("Invalid user token.");
    }
  });

  static getAllPost = asyncHandler(async (req, res) => {
    try {
      const allPost = await postModel.find({}).populate("creatorId");

      res.status(200).json({ allPost: allPost, status: "success" });
    } catch (error) {
      res.status(400);
      throw new Error("Can'n find all data.");
    }
  });

  static getLoggedUserPost = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
      const logingUser = await postModel
        .find({ creatorId: _id })
        .populate("creatorId");

      res.status(200).json({ allPost: logingUser, status: "success" });
    } catch (error) {
      res.status(400);
      throw new Error("Can'n find logging user post.");
    }
  });

  static getSingleQueryUser = asyncHandler(async (req, res) => {
    const { id } = req.query;

    try {
      const singleUser = await postModel
        .find({ creatorId: id })
        .populate("creatorId");
      res.status(200).json({ singleUser: singleUser, status: "success" });
    } catch (error) {
      res.status(400);
      throw new Error("Can'n find single user post.");
    }
  });

  static myUserId = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    res.status(200).json({ userId: _id });
  });
  // edit post

  static singleEditPost = asyncHandler(async (req, res) => {
    const { id } = req.query;
    try {
      const { post, tag } = req.body;
      if (post && tag) {
        const updatePost = await postModel.findByIdAndUpdate(
          { _id: id },
          {
            post: post,
            tag: tag,
          },
          {
            new: true,
          }
        );
        res.status(200).json({ status: "success", updatePost: updatePost });
      } else {
        res.status(400);
        throw new Error("All fields are required.");
      }
    } catch (error) {
      res.status(400);
      throw new Error("Can'n update single Post.");
    }
  });
  // Get single Post.
  static getSinglePost = asyncHandler(async (req, res) => {
    const { id } = req.query;
    try {
      const singlePost = await postModel.findById(id);
      res.status(200).json({ status: "success", singlePost: singlePost });
    } catch (error) {
      res.status(400);
      throw new Error("Can'n find single Post.");
    }
  });
  // delete post
  static deletePost = asyncHandler(async (req, res) => {
    const { id } = req.query;
    try {
      await postModel.findByIdAndDelete(id);
      res.status(200).json({ status: "success" });
    } catch (error) {
      res.status(400);
      throw new Error("Can'n delete single post.");
    }
  });
}
module.exports = blogController;
