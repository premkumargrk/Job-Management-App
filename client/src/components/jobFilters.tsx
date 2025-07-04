'use client';

import {
  TextField,
  Select,
  MenuItem,
  Autocomplete,
} from '@mui/material';

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined';
import { useEffect, useState } from 'react';
import { getLocations, getMinMaxSalary } from '@/services/jobService';

export default function JobFilters({ handleChange, filters }: any) {
  const [locations, setLocations] = useState<{ id: number; name: string }[]>([]);
  const [min_maxSalary, setMinMaxSalary] = useState([0, 0]);
  const [salaryRange, setSalaryRange] = useState(formatSalary(0, 0));
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
  useEffect(() => {
    const fetchMinMaxSalary = async () => {
      try {
        const res = await getMinMaxSalary();
        if (res.success) {
          console.log(res.data[0]);

          const salary = [res.data[0]?.salary_min, res.data[0]?.salary_max]
          setMinMaxSalary(salary[0] && salary[1] ? salary : [0, 0]);
          setSalaryRange(formatSalary(salary[0], salary[1]));
          handleChange(null, null, { 'salary_min': salary[0], 'salary_max': salary[1] })
        } else {
          console.log('Failed to fetch locations:', res.message);
          setMinMaxSalary([0, 0]);
        }
      } catch (error) {
        console.log('Error fetching locations:', error);
        setMinMaxSalary([0, 0]);
      }
    };
    fetchMinMaxSalary();
  }, []);

  // function convertSalary(money: number) {
  //   if (money < 1000) {
  //     return `₹${money}`;
  //   }
  //   if (money >= 1000 && money < 100000) {
  //     return `₹${(money / 1000).toFixed(1)}k`;
  //   }
  //   return `₹${((money * 12) / 100000).toFixed(1)}LPA`;
  // }
  function convertSalary(money: number) {
    return `₹${((money / 12)/1000).toFixed(0)}k`;
  }
  function formatSalary(min: number, max: number): string {
    return `${convertSalary(min)} - ${convertSalary(max)}`;
  }
  return (
    <div className="job-filtes">
      {/* Title */}
      <div className="cover-fields">
        <SearchOutlinedIcon className="menu-icon" />
        <TextField
          placeholder="Search By Job Title, Role"
          value={filters.title}
          InputProps={{
            sx: {
              '&.MuiOutlinedInput-root': {
                '& fieldset': {
                  border: 'none',
                },
                '&:hover fieldset': {
                  border: 'none',
                },
                '&.Mui-focused fieldset': {
                  border: 'none',
                },
                // Optional: remove box shadow on focus
                '&.Mui-focused': {
                  boxShadow: 'none',
                },
              },
            },
          }}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>

      {/* Location */}
      <div className="cover-fields">
        <LocationOnOutlinedIcon className="menu-icon" />
        <Autocomplete
          options={locations}
          getOptionLabel={(option) => option.name}
          value={
            filters.location_id === ''
              ? null
              : locations.find((loc) => loc.id === filters.location_id) || null
          }
          onChange={(e, value) => {
            handleChange('location_id', value ? value.id : '');
          }}
          filterOptions={(options, state) =>
            options.filter((option) =>
              option.name.toLowerCase().includes(state.inputValue.toLowerCase())
            )
          }
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.name}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Preferred Location"
              fullWidth
              InputProps={{
                ...params.InputProps,
                sx: {
                  '& fieldset': { border: 'none' },
                  '&:hover fieldset': { border: 'none' },
                  '&.Mui-focused fieldset': { border: 'none' },
                },
              }}
            />
          )}
          sx={{ width: '100%' }}
        />
      </div>


      {/* Job Type */}
      <div className="cover-fields">
        <RecordVoiceOverOutlinedIcon className="menu-icon" />
        <Select
          fullWidth
          name="job_type"
          value={filters.job_type}
          onChange={(e) => handleChange('job_type', e.target.value)}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
          }}
        >
          <MenuItem value="All Types">All Types</MenuItem>
          <MenuItem value="FullTime">Full Time</MenuItem>
          <MenuItem value="PartTime">Part Time</MenuItem>
          <MenuItem value="Internship">Internship</MenuItem>
          <MenuItem value="Contract">Contract</MenuItem>
        </Select>
      </div>

      {/* Salary Filter */}
      <div className="salary-filter cover-fields">
        <div>
          <p>Salary Per Month</p>
          <p className='salary-rage-title'>{salaryRange}</p>
        </div>
        <input
          type="range"
          value={filters.salary_min}
          min={min_maxSalary[0]}
          max={min_maxSalary[1]}
          onChange={(e) => {
            setSalaryRange(formatSalary(Number(e.target.value), min_maxSalary[1]));
            handleChange('salary_min', Number(e.target.value));
          }}
          style={{
            background: `linear-gradient(to right, black 0%, black ${(((filters.salary_min - min_maxSalary[0]) / (min_maxSalary[1] - min_maxSalary[0])) * 100).toFixed(0)}%, #ccc ${(((filters.salary_min - min_maxSalary[0]) / (min_maxSalary[1] - min_maxSalary[0])) * 100 - 2).toFixed(0)}%, #ccc 100%)`,
            width: "85%",
          }}
        />
      </div>
    </div>
  );
}
