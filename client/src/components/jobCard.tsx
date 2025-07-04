'use client';

import {
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Box,
  Chip,
} from '@mui/material';
import Image from 'next/image';
import { Job } from '@/types/job';
import BusinessIcon from '@mui/icons-material/Business';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';

export default function JobCard({ job }: { job: Job }) {
  function timeAgo(createdAt: any): string {
    if (!createdAt) return "Just Now";
    const now = new Date();
    const posted = new Date(createdAt);
    const diffMs = now.getTime() - posted.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min Ago`;

    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs} hr${diffHrs > 1 ? 's' : ''} Ago`;

    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays <= 90) return `${diffDays} day${diffDays > 1 ? 's' : ''} Ago`;

    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} mnt Ago`;
  }

  // function formatSalaryLPA(min: number, max: number): string {
  //   const minLPA = ((min * 12) / 100000).toFixed(1);
  //   const maxLPA = ((max * 12) / 100000).toFixed(1);
  //   return `${minLPA} - ${maxLPA} LPA`;
  // }
  function formatSalaryLPA(min: number, max: number): string {
    const minLPA = (min / 100000).toFixed(1);
    const maxLPA = (max / 100000).toFixed(1);
    return `${minLPA} - ${maxLPA} LPA`;
  }
  const companyLogos: Record<string, string> = {
    amazon: '/img/amazon.jpg',
    swiggy: '/img/swiggy.png',
    tesla: '/img/tesla.png',
  };
  return (
    <Card
      sx={{
        width: 290,
        borderRadius: 3,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        height: '100%'
      }}
    >

      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box display="flex" justifyContent={"space-between"}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Avatar sx={{ background: 'linear-gradient(120deg,#fdfdfb,#eee,#eee)', boxShadow: '0 0 5px 1px rgba(221, 220, 220, 0.7)', width: 56, height: 56, borderRadius: '10px', padding: '5px' }}>
              {companyLogos[job.company_name.toLowerCase()] ? (
                <Image
                  src={companyLogos[job.company_name.toLowerCase()]}
                  alt={job.company_name}
                  width={40}
                  height={40}
                  style={{ borderRadius: '50px' }}
                />
              ) : (
                <BusinessIcon />
              )}
            </Avatar>
            <Typography variant="subtitle1">
              {companyLogos[job.company_name.toLowerCase()] ? '' : job.company_name}
            </Typography>
          </Box>
          <Chip
            label={timeAgo(job?.created_at)}
            size="small"
            sx={{ fontWeight: 600, fonttSize: '14px', backgroundColor: '#b1d9fc', borderRadius: '8px', padding: '10px 5px', position: 'absolute', top: '15px', right: '15px' }}
          />
        </Box>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          {job.title}
        </Typography>
        <Box display="flex" gap={2} my={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <BusinessIcon sx={{ color: '#444', fontSize: '18px' }} />
            <Typography variant="body2">{job.job_type}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <LayersOutlinedIcon sx={{ color: '#444', fontSize: '18px' }} />
            <Typography variant="body2">{job.salary_min && job.salary_max ? formatSalaryLPA(job.salary_min, job.salary_max) : 'Not Applicable'}</Typography>
          </Box>
        </Box>

        <Typography variant="body2" my={1} color="text.secondary" component="ul" sx={{ pl: 2 }}>
          {job.description
            .split('.')
            .map(point => point.trim())
            .filter(point => point.length > 0)
            .map((point, index) => (
              <li key={index}>{point}.</li>
            ))}
        </Typography>

        <Box mt="auto">
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#007FFF',
              textTransform: 'capitalize',
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              padding: '10px',
              borderRadius: '8px',
              boxShadow: "0 0 2px 2px rgba(211, 212, 214, 0.4)"
            }}
          >
            Apply Now
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
