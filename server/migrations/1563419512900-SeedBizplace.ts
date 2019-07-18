import { Bizplace, Company } from '@things-factory/biz-base'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'
import { csvToJson } from '../seed-data/csv-to-json'

const seedFilePath = '../seed-data/bizplace.csv'

export class SeedBizplace1563352365741 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const json = await csvToJson(path.resolve(__dirname, seedFilePath))
    const bizplaces = []

    for (let i = 0; i < json.length; i++) {
      bizplaces.push({
        ...json[i],
        parent: await getRepository(Company).findOne({ where: { name: json[i].parentName } })
      })
    }

    try {
      await getRepository(Bizplace)
        .createQueryBuilder()
        .insert()
        .into(Bizplace)
        .values(bizplaces)
        .execute()
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const json = await csvToJson(path.resolve(__dirname, seedFilePath))

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