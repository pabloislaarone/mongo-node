import postRepository from "../repositories/postRepository.js";
import userRepository from "../repositories/userRepository.js";

function parseHashtags(hashtags) {
    if (Array.isArray(hashtags)) return hashtags;
    if (typeof hashtags === "string") {
        return hashtags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);
    }
    return [];
}

class PostService {
    async createPost(authorName, postData) {
        const user = await userRepository.findByFullName(authorName);
        if (!user) throw new Error(`No existe ningún usuario con el nombre "${authorName}"`);

        return await postRepository.create({
            ...postData,
            hashtags: parseHashtags(postData.hashtags),
            user: user._id,
        });
    }

    async updatePost(postId, postData) {
        return await postRepository.update(postId, {
            ...postData,
            hashtags: parseHashtags(postData.hashtags),
        });
    }

    async deletePost(postId) {
        return await postRepository.delete(postId);
    }

    async getPost(postId) {
        return await postRepository.findById(postId);
    }

    async getPosts() {
        return await postRepository.findAll();
    }

    async getPostsByUser(userId) {
        return await postRepository.findByUser(userId);
    }

    computeStats(posts) {
        const hashtagSet = new Set();
        const authorSet = new Set();
        posts.forEach((post) => {
            (post.hashtags || []).forEach((tag) => hashtagSet.add(tag.toLowerCase()));
            if (post.user) authorSet.add(String(post.user._id));
        });

        const topHashtags = hashtagSet.size > 0
            ? Array.from(hashtagSet).slice(0, 10)
            : ["viral", "tendencia", "compartir", "elmuro", "postealo"];

        return {
            posts: posts.length,
            hashtags: hashtagSet.size,
            authors: authorSet.size,
            topHashtags,
        };
    }
}

export default new PostService();
