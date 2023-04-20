import mongoose from 'mongoose';
// import moment from 'moment-timezone';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            minlength: 3,
        },
    },
    {
        timestamps: { createdAt: 'createdDate', updatedAt: 'modifyDate' },
        collection: 'users',
    },
);

// userSchema.virtual('adjustedTime').get(function () {
//     return moment.tz(this.sentTime, 'Asia/Jakarta').format();
// });

export default mongoose.model('Users', userSchema);
