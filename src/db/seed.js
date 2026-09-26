import connectDB from "./database.js";
import userRepository from "../repositories/userRepository.js";
import postRepository from "../repositories/postRepository.js";
import Post from "../models/Post.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const demoUsers = [
    {
        name: "Sofia",
        lastName: "Ramirez",
        email: "sofia.ramirez@tecsup.edu.pe",
        age: 21,
        phoneNumber: "955512345",
        password: "password123",
    },
    {
        name: "Diego",
        lastName: "Mendoza",
        email: "diego.mendoza@tecsup.edu.pe",
        age: 23,
        phoneNumber: "955523456",
        password: "password123",
    },
    {
        name: "Valentina",
        lastName: "Torres",
        email: "valentina.torres@tecsup.edu.pe",
        age: 20,
        phoneNumber: "955534567",
        password: "password123",
    },
    {
        name: "Mateo",
        lastName: "Flores",
        email: "mateo.flores@tecsup.edu.pe",
        age: 24,
        phoneNumber: "955545678",
        password: "password123",
    },
    {
        name: "Camila",
        lastName: "Rios",
        email: "camila.rios@tecsup.edu.pe",
        age: 22,
        phoneNumber: "955556789",
        password: "password123",
    },
];

const demoPosts = [
    {
        authorEmail: "sofia.ramirez@tecsup.edu.pe",
        title: "Atardecer en Miraflores",
        content: "El cielo se puso naranja y rosado hoy, no pude evitar tomar la foto. Amo esta ciudad al atardecer.",
        hashtags: ["atardecer", "lima", "viajes"],
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0QYfpLNuZ6PBOeGSuzUYWbm22HIileqvRFTXVEw62AYSRC1MoTKv2rio&s=10",
    },
    {
        authorEmail: "diego.mendoza@tecsup.edu.pe",
        title: "Nuevo proyecto en camino",
        content: "Después de semanas programando por fin tengo algo que mostrar. Pronto les cuento los detalles.",
        hashtags: ["codigo", "tecnologia", "devlife"],
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_HRaaGO65T-tQQCtmqBFnt75mnp22p8Qk6eVvHukPYsEuMw5IOL5RFJ8&s=10",
    },
    {
        authorEmail: "valentina.torres@tecsup.edu.pe",
        title: "Brunch de domingo",
        content: "Nada como empezar el domingo con un buen café y pancakes caseros. Receta en los comentarios.",
        hashtags: ["comida", "domingo", "cafe"],
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1ndEN0SGXrHuwt7L4GTVliR8isA70pn1dHOpSBwLlv49C6BkVj9Nz5YU&s=10",
    },
    {
        authorEmail: "mateo.flores@tecsup.edu.pe",
        title: "Entrenamiento matutino",
        content: "6am y ya estamos en la pista. La constancia es lo que hace la diferencia a largo plazo.",
        hashtags: ["fitness", "rutina", "motivacion"],
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIzoRcBe65qJeF-xV7fmmwjly0D1n6eqyksVZPxUxnuc2R1eC6wkf6kFk&s=10",
    },
    {
        authorEmail: "camila.rios@tecsup.edu.pe",
        title: "Mi rincón de lectura",
        content: "Encontré el lugar perfecto para leer los fines de semana. Este libro me está encantando.",
        hashtags: ["lectura", "libros", "relax"],
        imageUrl: "https://static.bainet.es/clip/28bbefe9-25c1-48fa-a92e-0ee5ddbde73d_source-aspect-ratio_1200w_0.jpg",
    },
];

await connectDB();

const existingUsers = await userRepository.findAll();
const existingEmails = existingUsers.map((user) => user.email);

for (const demoUser of demoUsers) {
    if (existingEmails.includes(demoUser.email)) {
        console.log("Usuario ya existe:", demoUser.email);
        continue;
    }
    const user = await userRepository.create(demoUser);
    console.log("Usuario de prueba creado:", user.email);
}

const deleted = await Post.deleteMany({});
console.log(`Posts anteriores eliminados: ${deleted.deletedCount}`);

const users = await userRepository.findAll();
for (const demoPost of demoPosts) {
    const { authorEmail, ...postData } = demoPost;
    const user = users.find((u) => u.email === authorEmail);
    if (!user) {
        console.log("No se encontró usuario para:", authorEmail);
        continue;
    }
    const post = await postRepository.create({ ...postData, user: user._id });
    console.log("Post creado:", post.title);
}

await mongoose.connection.close();
