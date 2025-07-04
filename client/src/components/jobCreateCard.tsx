'use client';

import {
  Modal,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Autocomplete,
} from '@mui/material';
import { useEffect, useState } from 'react';
import KeyboardDoubleArrowDownOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowDownOutlined';
import { createJob, getLocations, getMinMaxSalary } from '@/services/jobService';

export default function JobCreateCard({ open, onClose, fetchJobs, filters, handleChanged }: any) {
  const [locations, setLocations] = useState<{ id: number; name: string }[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: null as { id: number; name: string } | null,
    jobType: 'FullTime',
    salaryFrom: '',
    salaryTo: '',
    deadline: '',
    description: '',
  });

  const fetchMinMaxSalary = async () => {
    try {
      const res = await getMinMaxSalary();
      if (res.success) {
        console.log(res.data[0]);

        const salary = [res.data[0]?.salary_min, res.data[0]?.salary_max]
        handleChanged(null, null, { 'salary_min': salary[0], 'salary_max': salary[1] }, true)
      } else {
        console.log('Failed to fetch locations:', res.message);
      }
    } catch (error) {
      console.log('Error fetching locations:', error);
    }
  };
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await getLocations();
        if (res.success) {
          setLocations(res.data || []);
        } else {
          console.log('Failed to fetch locations:', res.message);
          setLocations([]);
        }
      } catch (error) {
        console.log('Error fetching locations:', error);
        setLocations([]);
      }
    };

    fetchLocations();
  }, []);

  const handleLocationChange = (event: any, newValue: { id: number; name: string } | null) => {
    setFormData(prev => ({
      ...prev,
      location: newValue,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      title: formData.title,
      company_name: formData.company,
      location_id: formData.location?.id ?? null,
      job_type: formData.jobType,
      salary_min: formData.salaryFrom ? Number(formData.salaryFrom) : 0,
      salary_max: formData.salaryTo ? Number(formData.salaryTo) : 0,
      deadline: formData.deadline,
      description: formData.description,
    };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(payload.deadline);
    if (deadlineDate < today) {
      alert('Deadline must be today or a future date.')
      return;
    }
    payload.deadline = new Date(payload.deadline).toISOString().split('T')[0];

    if (payload.location_id == null) {
      alert('Failed to create job: Location is not available');
      return;
    }
    if (payload.salary_min > payload.salary_max) {
      alert('Failed to create job: Invalid Salary Input');
      return;
    }
    try {
      const res = await createJob(payload);
      if (res?.success) {
        alert('Job created successfully!');
        fetchMinMaxSalary();
        setFormData({
          title: '',
          company: '',
          location: null as { id: number; name: string } | null,
          jobType: 'FullTime',
          salaryFrom: '',
          salaryTo: '',
          deadline: '',
          description: '',
        });
        onClose();
        fetchJobs(filters);
      } else {
        alert('Failed to create job: ' + res?.message);
      }
    } catch (error) {
      console.error('Error submitting job:', error);
      alert('An error occurred while submitting the job.');
    }

  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="job-modal-box" sx={{ maxWidth: 600, bgcolor: 'background.paper', p: 4, mx: 'auto',my: 'auto', borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={600} mb={3} textAlign="center">
          Create Job Opening
        </Typography>

        {/* Job Title and Company */}
        <Box display="flex" gap={2} mb={2}>
          <Box flex={1}>
            <Typography variant="body1" gutterBottom>
              Job Title
            </Typography>
            <TextField
              fullWidth
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Job Title"
            />
          </Box>

          <Box flex={1}>
            <Typography variant="body1" gutterBottom>
              Company Name
            </Typography>
            <TextField
              fullWidth
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Amazon, Microsoft, Swiggy"
            />
          </Box>
        </Box>

        {/* Location and Job Type */}
        <Box display="flex" gap={2} mb={2}>
          <Box flex={1}>
            <Typography variant="body1" gutterBottom>
              Location
            </Typography>
            <Autocomplete
              options={locations}
              value={formData.location}
              onChange={handleLocationChange}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              noOptionsText="No matching locations"
              renderInput={(params) => (
                <TextField {...params} placeholder="Choose Preferred Location" fullWidth />
              )}
              filterOptions={(options, state) => {
                const filtered = options.filter((option) =>
                  option.name.toLowerCase().includes(state.inputValue.toLowerCase())
                );
                return filtered.length > 0 ? filtered : [];
              }}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>{option.name}</li>
              )}
            />

          </Box>

          <Box flex={1}>
            <Typography variant="body1" gutterBottom>
              Job Type
            </Typography>
            <Select
              fullWidth
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value="FullTime">Full Time</MenuItem>
              <MenuItem value="PartTime">Part Time</MenuItem>
              <MenuItem value="Internship">Internship</MenuItem>
              <MenuItem value="Contract">Contract</MenuItem>
            </Select>
          </Box>
        </Box>

        {/* Salary Range and Deadline */}
        <Box display="flex" justifyContent="space-between" width="100%" gap={2} mb={2}>
          <Box display="flex" gap={2} width="50%">
            <Box flex={1}>
              <Typography variant="body1" gutterBottom>
                Salary Range
              </Typography>
              <TextField
                fullWidth
                type="number"
                name="salaryFrom"
                value={formData.salaryFrom}
                onChange={handleChange}
                placeholder="↑↓ ₹0"
              />
            </Box>

            <Box flex={1}>
              <Typography variant="body1" gutterBottom>
                &nbsp;
              </Typography>
              <TextField
                fullWidth
                type="number"
                name="salaryTo"
                value={formData.salaryTo}
                onChange={handleChange}
                placeholder="↑↓ ₹12,00,000"
              />
            </Box>
          </Box>

          <Box width="50%">
            <Typography variant="body1" gutterBottom>
              Application Deadline
            </Typography>
            <TextField
              fullWidth
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
            />
          </Box>
        </Box>

        {/* Job Description */}
        <Box>
          <Typography variant="body1" gutterBottom>
            Job Description
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Please share a description to let the candidate know more about the job role"
            sx={{ mb: 3 }}
          />
        </Box>


        {/* Buttons */}
        <Box display="flex" justifyContent="space-between">
          <Button
            variant="outlined"
            sx={{ px: 4, textTransform: 'capitalize', border: 'black solid 1px', color: 'black', cursor: 'pointer' }}
            onClick={() => onClose()}
          >
            Save Draft <KeyboardDoubleArrowDownOutlinedIcon sx={{ fontSize: '15px' }} />
          </Button>
          <Button
            variant="contained"
            sx={{ px: 4, backgroundColor: '#007FFF', cursor: 'pointer' }}
            onClick={handleSubmit}
          >
            Publish <KeyboardDoubleArrowDownOutlinedIcon sx={{ fontSize: '15px', transform: 'rotateZ(-90deg)' }} />
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
