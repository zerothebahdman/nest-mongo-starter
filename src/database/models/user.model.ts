// /* eslint-disable no-param-reassign */
// import { Schema, model } from 'mongoose';

// const userSchema = new Schema<User>(
//   {
//     firstName: {
//       type: String,
//       required: false,
//       trim: true,
//     },
//     lastName: {
//       type: String,
//       required: false,
//       trim: true,
//     },
//     middleName: {
//       type: String,
//       required: false,
//       trim: true,
//     },
//     email: {
//       type: String,
//       trim: true,
//       lowercase: true,
//     },
//     phoneNumber: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: false,
//       trim: true,
//     },
//     verifiedAt: Date,
//     verificationToken: String,
//     verificationTokenExpiry: Date,
//     passwordResetToken: String,
//     passwordResetTokenExpiresAt: Date,
//     pushNotificationId: String,
//     allowPushNotification: {
//       type: Boolean,
//       default: true,
//     },
//     userAppVersion: String,
//     gender: {
//       type: String,
//       enum: Object.values(GENDER),
//     },
//     avatar: {
//       url: String,
//       publicId: String,
//     },
//     dob: {
//       type: Date,
//       required: false,
//     },
//     referralCode: String,
//     inviteCode: String,
//     deviceInfo: [Map],
//     accountStatus: {
//       type: String,
//       enum: Object.values(ACCOUNT_STATUS),
//       default: ACCOUNT_STATUS.PENDING,
//     },
//     meta: {
//       isDriverAvailableForRide: {
//         type: Boolean,
//         default: true,
//       },
//       lastLogin: Date,
//       bankName: String,
//       accountNumber: String,
//       driverLicenseNumber: String,
//       carBrand: String,
//       carModel: String,
//       carColor: String,
//       carPlateNumber: String,
//     },
//     systemCode: String,
//     location: {
//       latitude: Number,
//       longitude: Number,
//       state: String,
//       country: { type: String, default: 'Nigeria' },
//     },
//     kyc: {
//       meansOfIdentification: String,
//       identificationNumber: String,
//       identificationImage: {
//         url: String,
//         publicId: String,
//       },
//     },
//     subscription: {
//       type: Schema.Types.ObjectId,
//       ref: 'Subscription',
//     },
//     ...auditableFields,
//   },
//   {
//     timestamps: true,
//     toJSON: {
//       virtuals: true,
//       transform: function (_doc, ret) {
//         delete ret._id;
//         delete ret.passwordResetToken;
//         delete ret.passwordResetTokenExpiresAt;
//         delete ret.__v;
//         delete ret.password;
//         delete ret.emailVerificationTokenExpiry;
//         return ret;
//       },
//     },
//   },
// );

// // add plugin that converts mongoose to json
// userSchema.plugin(toJSON);
// userSchema.plugin(paginate);

// /**
//  * @typedef User
//  */
// const User: Pagination<User> = model<User, Pagination<User>>(
//   'User',
//   userSchema,
// );

// export default User;
