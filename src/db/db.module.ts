import { Module, Global } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const DATABASE_PROVIDER = 'DATABASE';

const databaseProvider = {
  provide: DATABASE_PROVIDER,
  useFactory: () => {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    return drizzle(pool, { schema });
  },
};

@Global()
@Module({
  providers: [databaseProvider],
  exports: [DATABASE_PROVIDER],
})
export class DbModule {}
