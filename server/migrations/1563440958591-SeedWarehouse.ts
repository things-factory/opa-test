import { Domain } from '@things-factory/shell'
import { Warehouse, Location } from '@things-factory/warehouse-base'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'
import { csvToJson } from '../seed-data/csv-to-json'

const seedFilePath = '../seed-data/warehouse.csv'

export class SeedWarehouse1563440958591 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const json = await csvToJson(path.resolve(__dirname, seedFilePath))

    for (let i = 0; i < json.length; i++) {
      Warehouse.push({
        ...json[i],
        damain: await getRepository(Domain).findOne({ where: { name: json[i].domain } }),
        locations: await getRepository(Location).findOne({ where: { name: json[i].parentName } })
      })
    }
    try {
      await getRepository(Warehouse)
        .createQueryBuilder()
        .insert()
        .into(Warehouse)
        .values(json)
        .execute()
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const json = await csvToJson(path.resolve(__dirname, seedFilePath))

    try {
      await getRepository(Warehouse)
        .createQueryBuilder()
        .delete()
        .from(Warehouse)
        .where('name IN (:...names)', { names: json.map(record => record.name) })
        .execute()
    } catch (e) {
      console.error(e)
    }
  }
}
