import { Bizplace, Worker } from '@things-factory/biz-base'
import { csvHeaderCamelizer, Domain } from '@things-factory/shell'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'

const seedFilePath = '../../seeds/worker.csv'

export class SeedWorker1563445212341 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const workers = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))

    for (let i = 0; i < workers.length; i++) {
      const worker = workers[i]
      worker.domain = await getRepository(Domain).findOne({ name: worker.domainName })
      worker.bizplace = await getRepository(Bizplace).findOne({ name: worker.bizplaceName })
    }

    try {
      await getRepository(Worker).save(workers)
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const workers = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))

    try {
      await getRepository(Worker)
        .createQueryBuilder()
        .delete()
        .from(Worker)
        .where('name IN (:...names)', { names: workers.map(worker => worker.name) })
        .execute()
    } catch (e) {
      console.error(e)
    }
  }
}
