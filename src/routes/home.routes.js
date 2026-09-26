import express from "express";
import postService from "../services/postService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await postService.getPosts();
  const stats = postService.computeStats(posts);
  res.render("home", { stats });
});

export default router;
