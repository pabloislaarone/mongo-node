import postService from "../services/postService.js";
import userRepository from "../repositories/userRepository.js";

async function getAuthorNames() {
    const users = await userRepository.findAll();
    return users.map((user) => `${user.name} ${user.lastName}`);
}

class PostController {
    async getAll(req, res) {
        try {
            const posts = await postService.getPosts();
            const stats = postService.computeStats(posts);
            res.render("posts", { posts, stats });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async showNewForm(req, res) {
        const authors = await getAuthorNames();
        res.render("postForm", { post: null, authors, error: null, formData: {} });
    }

    async showEditForm(req, res) {
        try {
            const { id } = req.params;
            const post = await postService.getPost(id);
            res.render("postForm", { post, authors: [], error: null, formData: {} });
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
            const authors = await getAuthorNames();
            res.status(400).render("postForm", {
                post: null,
                authors,
                error: error.message,
                formData: req.body,
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            await postService.updatePost(id, req.body);
            res.redirect("/posts");
        } catch (error) {
            const post = await postService.getPost(req.params.id);
            res.status(400).render("postForm", {
                post,
                authors: [],
                error: error.message,
                formData: req.body,
            });
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
