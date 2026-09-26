import User from "../models/User.js";

class UserRepository {
    async create(user) {
        return await User.create(user);
    }

    async findAll() {
        return await User.find();
    }

    async findById(id) {
        return await User.findById(id);
    }

    async findByFullName(fullName) {
        const users = await User.find();
        const normalized = fullName.trim().toLowerCase();
        return users.find(
            (user) => `${user.name} ${user.lastName}`.trim().toLowerCase() === normalized
        );
    }
}

export default new UserRepository();
