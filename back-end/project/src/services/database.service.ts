import { Injectable } from '@nestjs/common';
import { Pool, PoolClient, QueryResult } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DatabaseService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
    });
  }

  async query(text: string, values?: any[]): Promise<QueryResult> {
    const client: PoolClient = await this.pool.connect();
    try {
      return await client.query(text, values);
    } finally {
      client.release();
    }
  }
}
