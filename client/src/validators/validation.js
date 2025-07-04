import Joi from 'joi';

export const jobSchema = Joi.object({
  title: Joi.string().min(2).required(),
  companyName: Joi.string().min(2).required(),
  locationId: Joi.number().integer().positive().required(),
  jobType: Joi.string()
    .valid('FullTime', 'PartTime', 'Contract', 'Internship')
    .required(),
  salaryMin: Joi.number().integer().min(0).required(),
  salaryMax: Joi.number().integer().min(0).required(),
  description: Joi.string().min(10).required(),
});

export const locationSchema = Joi.object({
  name: Joi.string().required()
});