import fs = require('fs');
import { getConfigORM } from '../configurations/config.orm';

fs.writeFileSync(
  'ormconfig.json',
  JSON.stringify(getConfigORM(), null, 2),
);
