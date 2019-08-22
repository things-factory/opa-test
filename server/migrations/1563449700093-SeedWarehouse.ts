import { Bizplace } from '@things-factory/biz-base'
import { csvHeaderCamelizer, Domain } from '@things-factory/shell'
import { Warehouse } from '@things-factory/warehouse-base'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'

const seedFilePath = '../../seeds/warehouse.csv'

export class SeedWarehouse1563449700093 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const warehouses = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))

    for (let i = 0; i < warehouses.length; i++) {
      const warehouse = warehouses[i]
      warehouse.bizplace = await getRepository(Bizplace).findOne({
        where: { name: warehouse.bizplaceName },
        relations: ['domain']
      })

      warehouse.domain = await getRepository(Domain).findOne(warehouse.bizplace.domain.id)
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
