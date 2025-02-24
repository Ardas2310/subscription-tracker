import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Subscription name is required'],
			trim: true,
			minLength: 3,
			maxLength: 50,
		},
		price: {
			type: Number,
			required: [true, 'Subscription price is required'],
			min: [0, 'Price must be greater than 0'],
		},
		currency: {
			type: String,
			enum: ['USD', 'EUR', 'GBP'],
			default: 'EUR',
		},
		frequency: {
			type: String,
			enum: ['daily', 'weekly', 'monthly', 'annually'],
			default: 'monthly',
		},
		category: {
			type: String,
			enum: [
				'health',
				'finance',
				'education',
				'entertainment',
				'sports',
				'technology',
				'other',
			],
			required: true,
		},
		paymentMethod: {
			type: String,
			required: true,
			trim: true,
		},
		status: {
			type: String,
			enum: ['active', 'inactive'],
			default: 'active',
		},
		startDate: {
			type: Date,
			required: true,
			validate: {
				validator: (value) => value <= new Date(),
				message: 'Start date must be in the past',
			},
		},
		renewalDate: {
			type: Date,
			required: true,
			validate: {
                validator: function (value) {return value > this.startDate },
				message: 'RenewalDate date must be after the start date',
			},
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        }
	},
	{ timestamps: true }
);

subscriptionSchema.pre('save', function (next) {
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            annually: 365,
        };

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(
            this.renewalDate.getDate() + renewalPeriods[this.frequency]
        );
    }

    if (this.renewalDate < new Date()) {
        this.status = 'expired';
    }

    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;