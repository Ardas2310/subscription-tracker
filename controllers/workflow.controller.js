import { createRequire } from 'module';
import dayjs from 'dayjs';

import Subscription from '../models/subscription.model';
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');


export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if (!subscription || subscription.status !== 'active') return
    
    const renewalDate = dayjs(subscription.renewalDate);
    if (renewalDate.isBefore(dayjs())) {
        console.log(`Subscription ${subscriptionId} has expired`);
        return;
    }

    //TODO: Send reminder email to the user
});


const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    })
 };