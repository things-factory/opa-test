import { Role } from '@things-factory/auth-base'
import { Domain } from '@things-factory/shell'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'
import { csvToJson } from '../seed-data/csv-to-json'

const csvFilePath = '../seed-data/role.csv'

export class SeedRole1563435582792 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const roles = await csvToJson(path.resolve(__dirname, csvFilePath))
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

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
