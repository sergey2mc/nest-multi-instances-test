import { Process, Processor } from '@nestjs/bull';

import { DoneCallback, Job } from 'bull';
import * as moment from 'moment';

import { CornJobs, CRON_JOBS_MANAGER } from '@app/configs';

@Processor(CRON_JOBS_MANAGER)
export class CronProcessor {
  @Process({
    name: CornJobs.SOME_JOB,
    concurrency: 1,
  })
  private doSomeJob(job: Job<void>, done: DoneCallback) {
    return this.processJob(
      async () => {
        // Do something here
        console.log('SomeJob is doing...');
        return new Promise(resolve => {
          setTimeout(resolve, 5000);
        });
      },
      CornJobs.SOME_JOB,
      done,
    );
  }

  private async processJob(
    job: () => Promise<void>,
    name: string,
    done: () => void
  ) {
    console.log(`\x1b[34m[ RUN ]\x1b[0m ${moment().format('L LTS')} JOB ${name}`);
    job()
      .then(() => {
        console.log(`\x1b[32m[ OK ]\x1b[0m ${moment().format('L LTS')} JOB ${name}`);
        done();
      })
      .catch((error) => {
        console.log(`\x1b[31m[ ERROR ]\x1b[0m ${moment().format('L LTS')} JOB ${name}`);
        console.log(error);
      });
  }
}
