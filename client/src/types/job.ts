export interface Job {
  id?: number;
  title: string;
  company_name: string;
  location: string;
  job_type: 'FullTime' | 'PartTime' | 'Contract' | 'Internship';
  salary_min: number;
  salary_max: number;
  description: string;
  deadline: string;
  created_at?: string;
}
