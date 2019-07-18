import { MigrationInterface, QueryRunner, getRepository, Not, IsNull } from 'typeorm'
import { Domain } from '@things-factory/shell'

export class SeedDomain1000000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Domain)

    try {
      await repository.delete({ name: Not(IsNull()) })
      await repository.save({
        name: 'OPA',
        subdomain: 'opa',
        systemFlag: true
      })
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Domain)

    try {
      await repository.delete({ name: 'OPA' })
    } catch (e) {
      console.error(e)
    }
  }
}
