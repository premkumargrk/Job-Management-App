// src/location/location.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import * as fs from 'fs/promises';
// import path from 'path';

interface City {
  id: number;
  city: string;
  state: string;
}
interface CityWithId extends City {
  id: number;
}

@Injectable()
export class LocationService {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) { }

  // async getLocations() {
  //     try {
  //       const result = await this.pool.query('SELECT * FROM locations ORDER BY name ASC');
  //       return {
  //         status: true,
  //         data: result.rows,
  //         message: 'Locations fetched successfully',
  //       };
  //     } catch (error) {      
  //       return {
  //         status: false,
  //         message: `Failed to fetch locations: ${error.message}`,
  //       };
  //     }
  //   }

  async getLocations() {
    try {
      const citiesFile = process.cwd() + '/src/database/cities.json';
      const data = await fs.readFile(citiesFile, 'utf-8');
      const locations: City[] = JSON.parse(data);

      const locationsWithId = locations
        .sort((a, b) => a.city.localeCompare(b.city, undefined, { sensitivity: 'base' }))
        .map((location, index) => ({
          id: index+1,
          name: location.city,   // rename `city` → `name`
          state: location.state,
        }));


      return {
        status: true,
        data: locationsWithId,
        message: 'Locations fetched successfully',
      };

    } catch (error: any) {
      return {
        status: false,
        message: `Failed to fetch locations: ${error.message}`,
      };
    }
  }

}