import { Bizplace, Company } from '@things-factory/biz-base'
import { csvHeaderCamelizer } from '@things-factory/shell'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'
import { Domain } from '@things-factory/shell'

const seedFilePath = '../../seeds/bizplace.csv'

export class SeedBizplace1563419512900 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const bizplaces = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))

    for (let i = 0; i < bizplaces.length; i++) {
      const bizplace = bizplaces[i]
      bizplace.company = await getRepository(Company).findOne({ where: { name: bizplace.companyName } })
      bizplace.domain = await getRepository(Domain).save({ name: bizplace.name })

      try {
        await getRepository(Bizplace).save(bizplace)
      } catch (e) {
        console.error(e)
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const json = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))

    try {
      await getRepository(Bizplace)
        .createQueryBuilder()
        .delete()
        .from(Bizplace)
        .where('name IN (:...names)', { names: json.map(record => record.name) })
        .execute()
    } catch (e) {
      console.error(e)
    }
  }
}
