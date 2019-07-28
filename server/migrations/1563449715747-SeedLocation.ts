import { Domain } from '@things-factory/shell'
import { Location, Warehouse } from '@things-factory/warehouse-base'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'
import { csvHeaderCamelizer } from '@things-factory/shell'

const csvFilePath = '../../seeds/location.csv'

export class SeedLocation1563449715747 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Location)
    const locations = await csvHeaderCamelizer(path.resolve(__dirname, csvFilePath))

    for (let i = 0; i < locations.length; i++) {
      const location = locations[i]
      location.domain = await getRepository(Domain).findOne({ where: { name: 'SYSTEM' } })
      location.warehouse = await getRepository(Warehouse).findOne({ where: { name: location.warehouseName } })
    }

    try {
      await getRepository(Location).save(locations)
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const locations = await csvHeaderCamelizer(path.resolve(__dirname, csvFilePath))

    try {
      await getRepository(Location)
        .createQueryBuilder()
        .delete()
        .from(Location)
        .where('name IN (:...names)', { names: locations.map(location => location.name) })
        .execute()
    } catch (e) {
      console.error(e)
    }
  }
}
