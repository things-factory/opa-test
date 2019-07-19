import { Role } from '@things-factory/auth-base'
import { Domain } from '@things-factory/shell'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'
import { csvHeaderCamelizer } from '@things-factory/shell'

const csvFilePath = '../../seeds/role.csv'

export class SeedRole1563435582792 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const roles = await csvHeaderCamelizer(path.resolve(__dirname, csvFilePath))
    const repository = getRepository(Role)
    const domain = await getRepository(Domain).findOne({ name: 'SYSTEM' })

    try {
      await repository.save(
        roles.map(role => {
          return {
            ...role,
            domain
          }
        })
      )
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const roles = await csvHeaderCamelizer(path.resolve(__dirname, csvFilePath))

    try {
      await getRepository(Role)
        .createQueryBuilder()
        .delete()
        .from(Role)
        .where('name in (:...names)', roles.map(role => role.name))
        .execute()
    } catch (e) {
      console.error(e)
    }
  }
}
