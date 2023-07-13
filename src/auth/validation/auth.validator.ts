import * as Joi from 'joi';

export const createUser = Joi.object({
  firstName: Joi.string().min(3).lowercase().max(40).required(),
  lastName: Joi.string().min(3).lowercase().max(40).required(),
  gender: Joi.string().optional(),
  email: Joi.string().lowercase().optional().messages({
    'string.email': 'Oops!, you need to provide valid email address',
    'string.required': 'Oops!, you have to specify an email address',
  }),
  phoneNumber: Joi.string()
    .min(10)
    .max(14)
    .strict()
    .messages({
      'string.required': 'Oops!, you have to specify a phone number',
    })
    .required(),
  /** Password requirements:
   * At least 8 characters—the more characters, the better
   * A mixture of both uppercase and lowercase - letters
   * A mixture of letters and numbers
   * Inclusion of at least one special character, e.g., ! @ # ? ]
   */
  password: Joi.string()
    .min(6)
    .pattern(
      new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'),
    )
    .required()
    .messages({
      'string.pattern.base':
        'Oops!, password must be at least 6 characters long and must contain at least one uppercase letter, one lowercase letter, one number and one special character',
      'string.required': 'Oops!, you have to specify a password',
    }),
  confirmPassword: Joi.ref('password'),
  residentialAddress: Joi.string().min(3).max(40).required(),
  //   dob: Joi.date().required(),
  avatar: Joi.string().optional(),
});
