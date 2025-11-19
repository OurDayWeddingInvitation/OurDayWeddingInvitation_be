import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    omit: {
        wedd: {
            userId: true,
            createdAt: true,
            updatedAt: true,
        },
        weddSectSet: {
            weddingId: true,
            createdAt: true,
            updatedAt: true,
        }
    },
});

export default prisma;