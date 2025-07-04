// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';


import { getJobs } from '@/services/jobService';
import Image from 'next/image';

import CreateJobModal from '@/components/jobCreateCard';
import JobCard from '@/components/jobCard';
import JobFilters from '@/components/jobFilters';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    title: '',
    location_id: '',
    job_type: 'All Types',
    salary_min: 0,
    salary_max: 0,
  });

  const fetchJobs = async (filter = {}) => {
    try {
      const res = await getJobs(filter);
      if (res.success) {
        setJobs(res.data || []);
      } else {
        console.log('Failed to fetch locations:', res.message);
        setJobs([]);
      }
    } catch (error) {
      console.log('Error fetching locations:', error);
      setJobs([]);
    }
  };
  useEffect(() => {
    fetchJobs();
  }, [])

  const handleChange = (
    key: string,
    value: string | number,
    salary?: { salary_min?: number; salary_max?: number },
    load = false
  ) => {
    setFilters((prev) => {
      const updatedFilters = salary
        ? { ...prev, ...salary }
        : { ...prev, [key]: value };
      if (load) {
        updatedFilters['title'] = '';
        updatedFilters['location_id'] = '';
        updatedFilters['job_type'] = 'All Types';
      }
      (salary && !load) ? null : fetchJobs(updatedFilters);
      return updatedFilters;
    });
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="static" className='menu-bar'>
        <Toolbar className='menu-tool-bar'>

          <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }} className="menu-items">
            <Box display="flex" alignItems="center">
              <Image src="/logo.svg" alt="Logo" width={40} height={40} />
            </Box>

            <Typography variant="body1">
              Home
            </Typography>
            <Typography variant="body1">
              Find Jobs
            </Typography>
            <Typography variant="body1">
              Find Talents
            </Typography>
            <Typography variant="body1">
              About us
            </Typography>
            <Typography variant="body1">
              Testimonials
            </Typography>
            <Button variant="contained" className='create-btn' sx={{ cursor: 'pointer' }} onClick={() => setOpen(true)}>
              Create Jobs
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <CreateJobModal open={open} onClose={() => setOpen(false)} fetchJobs={fetchJobs} filters={filters} handleChanged={handleChange} />

      <Box>
        <JobFilters handleChange={handleChange} filters={filters} />
      </Box>
      <Box sx={{
        width: "90%",
        marginRight: "auto",
        marginLeft: "auto",
        boxSizing: 'border-box',
        position: "relative"
      }}>
        <Grid container spacing={2} mt={2} sx={{ width: "100%" }}>
          {jobs.map((job: any, index: number) => (
            <Grid
              key={job?.id ?? index}
              component="div"
              sx={{ display: 'flex', justifyContent: 'flex-start' }}
            >
              <JobCard job={job} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box >
  );
}
