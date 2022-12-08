import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { Queue } from 'bull';
import { combineLatest, from, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CornJobs, CRON_JOBS_MANAGER } from '@app/configs';

@Injectable()
export class CronService {
  constructor(
    @InjectQueue(CRON_JOBS_MANAGER) private readonly queue: Queue,
  ) {
    interval(60000).pipe(
      switchMap(() => combineLatest([
        from(this.queue.getJobCounts()),
        from(this.queue.count()),
        from(this.queue.getActive()),
        from(this.queue.getWaiting()),
      ])),
    ).subscribe(([
      { active, waiting, completed, delayed, failed },
      total,
      activeJobs,
      waitingJobs,
    ]) => {
      console.log(`<-------------------------------->`);
      console.log(`Jobs total:     ${total}`);
      console.log(`Jobs active:    ${active}`);
      console.log(`Jobs waiting:   ${waiting}`);
      console.log(`Jobs completed: ${completed}`);
      console.log(`Jobs delayed:   ${delayed}`);
      console.log(`Jobs failed:    ${failed}`);
      console.log(`<--------------->`);
      console.log(`Active jobs:    ${activeJobs.map((job) => job.name).join(' - ')}`);
      console.log(`Waiting jobs:   ${waitingJobs.map((job) => job.name).join(' - ')}`);
      console.log(`<-------------------------------->`);
    });
  }

  // every minute
  @Cron('0 * * * * *')
  async doSomethingEveryMinute() {
    return this.queue
      .add(CornJobs.SOME_JOB)
      .catch((e) =>
        console.log('ERR: someJob failed', e),
      );
  }
}
