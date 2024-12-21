import { CronJob } from 'cron';
import { prisma } from '../database/init.postgresql';

export const cronJob = new CronJob('0 0 1 * * *', async () => {
    console.log('init cronjob')
    try {
      console.log('Running scheduled job to delete old data...');
      const oneMonthAgo = new Date();
      oneMonthAgo.setSeconds(oneMonthAgo.getSeconds() - 1);
  
      await prisma.keyToken.deleteMany({
        where: {
          createdAt: {
            lt: oneMonthAgo,
          },
        },
      });
  
      console.log('Old data deleted successfully!');
    } catch (error) {
      console.error('Error while running scheduled job:', error);
    }
},
null, // onComplete
true, // start
'Asia/Ho_Chi_Minh');