// CommonJS 방식으로 수정
const fs = require('fs');
const path = require('path');

const moduleName = process.argv[2];

if (!moduleName) {
  console.error('❌ 모듈 이름을 입력해주세요. (예: npm run make user)');
  process.exit(1);
}

const baseDir = path.resolve('src');
const folders = ['routes', 'controllers', 'services', 'models'];

folders.forEach((folder) => {
  const dir = path.join(baseDir, folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `${moduleName}.${folder.slice(0, -1)}.ts`);
  if (fs.existsSync(filePath)) {
    console.log(`⚠️ 이미 존재: ${filePath}`);
    return;
  }

  const content = getTemplate(folder, moduleName);
  fs.writeFileSync(filePath, content);
  console.log(`✅ 생성됨: ${filePath}`);
});

function getTemplate(type, name) {
  switch (type) {
    case 'routes':
      return `import { Router } from 'express';
import { get${capitalize(name)} } from '../controllers/${name}.controller';

const router = Router();
router.get('/', get${capitalize(name)});
export default router;
`;
    case 'controllers':
      return `import { Request, Response } from 'express';
import * as ${name}Service from '../services/${name}.service';

export const get${capitalize(name)} = async (_req: Request, res: Response) => {
  const data = await ${name}Service.get${capitalize(name)}();
  res.json(data);
};
`;
    case 'services':
      return `import * as ${name}Model from '../models/${name}.model';

export const get${capitalize(name)} = async () => {
  return await ${name}Model.findAll();
};
`;
    case 'models':
      return `export const findAll = async () => {
  return [{ id: 1, name: '${capitalize(name)} 예시 데이터' }];
};
`;
    default:
      return '';
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
