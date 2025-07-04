import { Provider } from '@nestjs/common';
import { pool } from './config';

export const databaseProviders: Provider[] = [
    {
        provide: 'PG_POOL',
        useValue: pool, // Provide the same pool to NestJS
    },
];
