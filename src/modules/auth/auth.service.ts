import bcrypt from "bcrypt";
import type { LoginBody, RegisterBody } from "./auth.schema.js";
import { prisma } from "../../lib/prisma.js";

export class AuthService {
    async register(
        data: RegisterBody
    ) {

        const {
            name,
            email,
            password
        } = data;

        const userAlreadyExists = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (userAlreadyExists) throw new Error('User already exists');

        const SALT_ROUNDS = 10;

        const passwordHash = await bcrypt.hash(
            password,
            SALT_ROUNDS
        );

        const user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: passwordHash
            }
        });

        return user;
    };

    async login(
        data: LoginBody
    ) {
        const { email, password } = data;

        const user = await prisma.user.findUniqueOrThrow({
            where: {
                email
            }
        });

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
            throw new Error('Invalid Password');
        }

        return {
            id: user.id,
            email: user.email,
            password: user.password
        }

    }
}
