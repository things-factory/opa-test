import { Bizplace, Company } from '@things-factory/biz-base'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'
import { csvHeaderCamelizer } from '@things-factory/shell'

const seedFilePath = '../../seeds/bizplace.csv'

export class SeedBizplace1563352365741 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const bizplaces = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))

    for (let i = 0; i < bizplaces.length; i++) {
      const bizplace = bizplaces[i]
      bizplace.parent = await getRepository(Company).findOne({ where: { name: bizplace.parentName } })
    }

    try {
      await getRepository(Bizplace).save(bizplaces)
    } catch (e) {
      console.error(e)
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
