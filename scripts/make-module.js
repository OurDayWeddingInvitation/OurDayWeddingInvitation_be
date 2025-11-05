#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const moduleName = process.argv[2];
if (!moduleName) {
  console.error('❌ 모듈 이름을 입력해주세요. (예: npm run make user)');
  process.exit(1);
}

const baseDir = path.resolve('src');
const folders = ['routes', 'controllers', 'services'];

folders.forEach((folder) => {
  const dir = path.join(baseDir, folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `${moduleName}.${folder.slice(0, -1)}.ts`);
  if (fs.existsSync(filePath)) {
    console.log(`⚠️ 이미 존재: ${filePath}`);
    return;
  }

  const content = getTemplate(folder, moduleName);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ 생성됨: ${filePath}`);
});

function getTemplate(type, name) {
  const Name = capitalize(name);

  switch (type) {
    case 'routes':
      return `import { Router } from 'express';
import * as ${name}Controller from '../controllers/${name}.controller';

const router = Router();

/**
 * @swagger
 * /api/:
 *   get:
 *     summary: 전체 조회
 *     tags: [${Name}]
 *     responses:
 *       200:
 *         description: 성공
 */
router.get('/', ${name}Controller.getAll${Name}s);

/**
 * @swagger
 * /api/:
 *   get:
 *     summary: 조회
 *     tags: [${Name}]
 */
router.get('/:id', ${name}Controller.get${Name}ById);

/**
 * @swagger
 * /api/:
 *   post:
 *     summary: 생성
 *     tags: [${Name}]
 */
router.post('/', ${name}Controller.create${Name});

/**
 * @swagger
 * /api/:
 *   put:
 *     summary: 수정
 *     tags: [${Name}]
 */
router.put('/:id', ${name}Controller.update${Name});

/**
 * @swagger
 * /api/:
 *   delete:
 *     summary: 삭제
 *     tags: [${Name}]
 */
router.delete('/:id', ${name}Controller.delete${Name});

export default router;
`;

    case 'controllers':
  return `import { Request, Response } from 'express';
import * as ${name}Service from '../services/${name}.service';

/**
 * ${Name} 전체 조회
 */
export const getAll${Name}s = async (req: Request, res: Response) => {
  try {
    const  = await ${name}Service.getAll${Name}s();
    res.status(200).json({ success: true, data:  });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: '', detail: error.message });
  }
};

/**
 * ${Name} 단건 조회
 */
export const get${Name}ById = async (req: Request, res: Response) => {
  try {
    const  = await ${name}Service.get${Name}ById(Number(req.params.id));
    res.status(200).json({ success: true, data:  });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: '', detail: error.message });
  }
};

/**
 * ${Name} 생성
 */
export const create${Name} = async (req: Request, res: Response) => {
  try {
    const  = await ${name}Service.create${Name}(req.body);
    res.status(200).json({ success: true, data:  });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: '', detail: error.message });
  }
};

/**
 * ${Name} 수정
 */
export const update${Name} = async (req: Request, res: Response) => {
  try {
    const  = await ${name}Service.update${Name}(Number(req.params.id), req.body);
    res.status(200).json({ success: true, data:  });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: '', detail: error.message });
  }
};

/**
 * ${Name} 삭제
 */
export const delete${Name} = async (req: Request, res: Response) => {
  try {
    await ${name}Service.delete${Name}(Number(req.params.id));
    res.status(200).json({ success: true, message: '삭제 완료' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: '', detail: error.message });
  }
};
`;

    case 'services':
      return `import prisma from '../prisma/client';

/**
 * 모든 ${Name} 조회
 */
export const getAll${Name}s = async () => {
  return await prisma.${name}.findMany();
};

/**
 * 단일 ${Name} 조회
 */
export const get${Name}ById = async (id: number) => {
  return await prisma.${name}.findUnique({
    where: { ${name}Id: id },
  });
};

/**
 * ${Name} 생성
 */
export const create${Name} = async (data: any) => {
  return await prisma.${name}.create({
    data,
  });
};

/**
 * ${Name} 수정
 */
export const update${Name} = async (id: number, data: any) => {
  return await prisma.${name}.update({
    where: { ${name}Id: id },
    data,
  });
};

/**
 * ${Name} 삭제
 */
export const delete${Name} = async (id: number) => {
  return await prisma.${name}.delete({
    where: { ${name}Id: id },
  });
};
`;
    default:
      return '';
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
