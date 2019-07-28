import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'
import path from 'path'
import { Warehouse } from '@things-factory/warehouse-base'
import { Bizplace } from '@things-factory/biz-base'
import { Domain, csvHeaderCamelizer } from '@things-factory/shell'

const seedFilePath = '../../seeds/warehouse.csv'

export class SeedWarehouse1563449700093 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const warehouses = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))

    for (let i = 0; i < warehouses.length; i++) {
      const warehouse = warehouses[i]
      warehouse.domain = await getRepository(Domain).findOne({ where: { name: 'SYSTEM' } })
      warehouse.bizplace = await getRepository(Bizplace).findOne({ where: { name: warehouse.bizplaceName } })
    }

    try {
      await getRepository(Warehouse).save(warehouses)
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const warehouses = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))

    try {
      await getRepository(Warehouse)
        .createQueryBuilder()
        .delete()
        .from(Warehouse)
        .where('name IN (:...names)', { names: warehouses.map(warehouse => warehouse.name) })
        .execute()
    } catch (e) {
      console.error(e)
    }
  }
}
