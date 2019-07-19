import { Domain } from '@things-factory/shell'
import { Location } from '@things-factory/warehouse-base'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'
import { csvHeaderCamelizer } from '@things-factory/shell'

const csvFilePath = '../../seeds/location.csv'

export class SeedLocation1563449715747 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Location)
    const locations = await csvHeaderCamelizer(path.resolve(__dirname, csvFilePath))
    const domain = await getRepository(Domain).findOne({ name: 'SYSTEM' })

    try {
      await repository.save(
        locations.map(loc => {
          return {
            domain,
            ...loc
          }
        })
      )
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
        .where('name in (:...names)', locations.map(loc => loc.name))
        .execute()
    } catch (e) {
      console.error(e)
    }
  }
}
