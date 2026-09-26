import postService from "../services/postService.js";

class PostController {
    async getAll(req, res) {
        try {
            const posts = await postService.getPosts();
            res.render("posts", { posts });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async showNewForm(req, res) {
        res.render("postForm", { post: null });
    }

    async showEditForm(req, res) {
        try {
            const { id } = req.params;
            const post = await postService.getPost(id);
            res.render("postForm", { post });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const { authorName, ...postData } = req.body;
            await postService.createPost(authorName, postData);
            res.redirect("/posts");
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            await postService.updatePost(id, req.body);
            res.redirect("/posts");
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await postService.deletePost(id);
            res.redirect("/posts");
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new PostController();
