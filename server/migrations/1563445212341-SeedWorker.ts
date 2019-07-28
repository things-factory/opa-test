import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'
import path from 'path'
import { Worker, Bizplace } from '@things-factory/biz-base'
import { Domain, csvHeaderCamelizer } from '@things-factory/shell'

const seedFilePath = '../../seeds/worker.csv'

export class SeedWorker1563445212341 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const workers = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))

    for (let i = 0; i < workers.length; i++) {
      const worker = workers[i]
      worker.domain = await getRepository(Domain).findOne({ where: { name: 'SYSTEM' } })
      worker.bizplace = await getRepository(Bizplace).findOne({ where: { name: worker.bizplaceName } })
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
