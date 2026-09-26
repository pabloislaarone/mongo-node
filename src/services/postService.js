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
}

export default new PostService();
