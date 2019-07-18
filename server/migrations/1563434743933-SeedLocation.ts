import { Domain } from '@things-factory/shell'
import { Location } from '@things-factory/warehouse-base'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'
import { csvToJson } from '../seed-data/csv-to-json'

const seedFilePath = '../seed-data/location.csv'

export class SeedLocation1563434743933 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const json = await csvToJson(path.resolve(__dirname, seedFilePath))

    for (let i = 0; i < json.length; i++) {
      Location.push({
        ...json[i],
        damain: await getRepository(Domain).findOne({ where: { name: json[i].domain } })
      })
    }
    try {
      await getRepository(Location)
        .createQueryBuilder()
        .insert()
        .into(Location)
        .values(json)
        .execute()
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const json = await csvToJson(path.resolve(__dirname, seedFilePath))

    try {
      await getRepository(Location)
        .createQueryBuilder()
        .delete()
        .from(Location)
        .where('name IN (:...names)', { names: json.map(record => record.name) })
        .execute()
    } catch (e) {
      console.error(e)
    }
  }
}
