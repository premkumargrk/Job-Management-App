// src/job/job.service.ts
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Pool } from 'pg';

import * as fs from 'fs/promises';
// import path from 'path';
interface Job {
  id: number;
  title: string;
  company_name: string;
  location_id: number;
  job_type: string;
  salary_min: number;
  salary_max: number;
  description: string;
  deadline: string;
  created_at: string;
}

interface City {
  id: number;
  city: string;
  state: string;
}

@Injectable()
export class JobService {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) { }

  // async getJobs(filters: any) {
  //   try {
  //     this.pool.query(`DELETE FROM jobs WHERE deadline < NOW();`, (err, result) => {
  //       if (err) {
  //         console.error('Error deleting expired rows:', err);
  //       }
  //     })
  //     const { title, location_id, job_type, salary_min, salary_max } = filters;

  //     const conditions: string[] = [];

  //     if (title?.trim()) {
  //       conditions.push(`LOWER(title) LIKE LOWER('%${title.trim()}%')`);
  //     }

  //     if (location_id?.trim()) {
  //       conditions.push(`location_id = '${location_id}'`);
  //     }

  //     if (job_type?.trim()) {
  //       if (job_type.trim() != "All Types") {
  //         conditions.push(`job_type = '${job_type.trim()}'`);
  //       }
  //     }

  //     // if (salary_min) {
  //     //   conditions.push(`salary_min >= ${Number(salary_min)}`);
  //     // }

  //     if (salary_max) {
  //       conditions.push(`salary_max >= ${Number(salary_min)}`);
  //     }

  //     const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  //     const query = `SELECT * FROM jobs ${whereClause} ORDER BY created_at DESC`;

  //     const result = await this.pool.query(query);

  //     return {
  //       status: true,
  //       data: result.rows,
  //       message: 'Jobs fetched successfully',
  //     };
  //   } catch (error) {
  //     return {
  //       status: false,
  //       message: `Failed to fetch jobs: ${error.message}`,
  //     };
  //   }
  // }

  async getJobs(filters: any) {
    try {

      const jobsFile = process.cwd() + '/src/database/jobs.json';
      const citiesFile = process.cwd() + '/src/database/cities.json';

      // Read JSON files
      const [jobsData, citiesData] = await Promise.all([
        fs.readFile(jobsFile, 'utf-8'),
        fs.readFile(citiesFile, 'utf-8')
      ]);

      let jobs: Job[] = JSON.parse(jobsData);
      const cities: City[] = JSON.parse(citiesData);

      const today = new Date();

      // ✅ 1. Remove expired jobs and update file
      const validJobs = jobs.filter(job => new Date(job.deadline) >= today);
      if (validJobs.length !== jobs.length) {
        await fs.writeFile(jobsFile, JSON.stringify(validJobs, null, 2), 'utf-8');
      }
      jobs = validJobs;

      // ✅ 2. Filtering
      const { title, location_id, job_type, salary_min, salary_max } = filters;

      let filteredJobs = jobs.filter(job => {
        if (title && !job.title.toLowerCase().includes(title.toLowerCase())) return false;
        if (location_id && job.location_id !== Number(location_id)) return false;
        if (job_type && job_type !== 'All Types' && job.job_type !== job_type) return false;
        if (salary_max && job.salary_max < Number(salary_min)) return false;
        return true;
      });

      // ✅ 3. Map location_id to city/state
      filteredJobs = filteredJobs.map(job => {
        const cityObj = cities.find(c => c.id === job.location_id);
        return {
          ...job,
          location: cityObj ? `${cityObj.city}, ${cityObj.state}` : 'Unknown'
        };
      });

      // ✅ 4. Sort by created_at DESC (latest first)
      filteredJobs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return {
        status: true,
        data: filteredJobs,
        message: 'Jobs fetched successfully'
      };

    } catch (error: any) {
      return {
        status: false,
        message: `Failed to fetch jobs: ${error.message}`
      };
    }
  }

  async getMinSalary() {
    try {
      const jobsFile = process.cwd() + '/src/database/jobs.json'
      const jobsData = await fs.readFile(jobsFile, 'utf-8');
      const jobs = JSON.parse(jobsData);

      if (jobs.length === 0) {
        return {
          status: true,
          data: { salary_min: 0, salary_max: 0 },
          message: 'No jobs found',
        };
      }

      const salaryMaxValues = jobs.map(job => job.salary_max);
      const salary_min = Math.min(...salaryMaxValues);
      const salary_max = Math.max(...salaryMaxValues);

      return {
        status: true,
        data: [{ salary_min, salary_max }],
        message: 'Salary fetched successfully',
      };

    } catch (error: any) {
      return {
        status: false,
        message: `Failed to fetch salary: ${error.message}`,
      };
    }
  }

  //   async createJob(job: any) {
  //   try {
  //     const {
  //       title, company_name, location_id,
  //       job_type, salary_min, salary_max, description,
  //       deadline,
  //     } = job;

  //     if (!title || !company_name || !location_id || !job_type) {
  //       return {
  //         status: false,
  //         message: 'Missing required fields',
  //       };
  //     }

  //     const duplicateCheckQuery = `
  //       SELECT id FROM jobs
  //       WHERE LOWER(title) = LOWER($1)
  //         AND LOWER(company_name) = LOWER($2)
  //         AND LOWER(job_type) = LOWER($3)
  //     `;
  //     const existing = await this.pool.query(duplicateCheckQuery, [title, company_name, job_type]);

  //     if (existing.rows.length > 0) {
  //       return {
  //         status: false,
  //         message: `A job titled "${title}" already exists at "${company_name}" for "${job_type}" role.`,
  //       };
  //     }

  //     const insertQuery = `
  //       INSERT INTO jobs (
  //         title, company_name, location_id, job_type,
  //         salary_min, salary_max, description, deadline
  //       )
  //       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  //       RETURNING *
  //     `;
  //     const result = await this.pool.query(insertQuery, [
  //       title, company_name, location_id, job_type,
  //       salary_min, salary_max, description, deadline
  //     ]);

  //     return {
  //       status: true,
  //       data: result.rows[0],
  //       message: 'Job created successfully',
  //     };
  //   } catch (error) {
  //     return {
  //       status: false,
  //       message: `Failed to create job: ${error.message}`,
  //     };
  //   }
  // }
  async createJob(job: any) {
    try {
      const jobsFile = process.cwd() + '/src/database/jobs.json';

      // Required fields check
      const { title, company_name, location_id, job_type, salary_min, salary_max, description, deadline } = job;
      if (!title || !company_name || !location_id || !job_type || !description || !deadline) {
        return {
          status: false,
          message: 'Missing required fields',
        };
      }


      // Read existing jobs
      const jobsData = await fs.readFile(jobsFile, 'utf-8');
      const jobs: Job[] = JSON.parse(jobsData);

      // Check for duplicates
      const isDuplicate = jobs.some(j =>
        j.title.toLowerCase() === title.toLowerCase() &&
        j.company_name.toLowerCase() === company_name.toLowerCase() &&
        j.job_type.toLowerCase() === job_type.toLowerCase()
      );

      if (isDuplicate) {
        return {
          status: false,
          message: `A job titled "${title}" already exists at "${company_name}" for "${job_type}" role.`,
        };
      }

      // Create new job with new unique id
      const newJob: Job = {
        id: jobs.length > 0 ? Math.max(...jobs.map(j => j.id)) + 1 : 1,
        title,
        company_name,
        location_id: Number(location_id),
        job_type,
        salary_min: Number(salary_min),
        salary_max: Number(salary_max),
        description,
        deadline,
        created_at: new Date().toISOString()
      };

      // Append and save
      jobs.push(newJob);
      await fs.writeFile(jobsFile, JSON.stringify(jobs, null, 2));

      return {
        status: true,
        data: newJob,
        message: 'Job created successfully',
      };

    } catch (error: any) {
      return {
        status: false,
        message: `Failed to create job: ${error.message}`,
      };
    }
  }
}
