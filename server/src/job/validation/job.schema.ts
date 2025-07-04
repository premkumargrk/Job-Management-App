const Joi = require('joi');


export const jobSchema = Joi.object({
  title: Joi.string().min(2).required(),
  company_name: Joi.string().min(2).required(),
  location_id: Joi.number().integer().positive().required(),
  job_type: Joi.string()
    .valid('FullTime', 'PartTime', 'Contract', 'Internship')
    .required(),
  salary_min: Joi.number().integer().min(0).required(),
  salary_max: Joi.number().integer().min(1).required(),
  deadline: Joi.date().iso().required(),
  description: Joi.string().min(5).required(),
});
