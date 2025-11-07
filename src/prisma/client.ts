import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    omit: {
        wedd: {
            userId: true,
            creatDt: true,
            updtDt: true,
        },
    },
});

export default prisma;