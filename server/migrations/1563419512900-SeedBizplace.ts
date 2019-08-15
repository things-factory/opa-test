import { Bizplace, Company } from '@things-factory/biz-base'
import { csvHeaderCamelizer } from '@things-factory/shell'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'

const seedFilePath = '../../seeds/bizplace.csv'

export class SeedBizplace1563352365741 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const bizplaces = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))
    const companies = await getRepository(Company).find()

    for (let i = 0; i < companies.length; i++) {
      const company = companies[i]
      const _bizplaces = []

      for (let j = 0; j < bizplaces.length; j++) {
        const bizplace = { ...bizplaces[j] }
        bizplace.company = company
        bizplace.name = `${bizplace.name}-${i}`
        _bizplaces.push(bizplace)
      }

      try {
        await getRepository(Bizplace).save(_bizplaces)
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
