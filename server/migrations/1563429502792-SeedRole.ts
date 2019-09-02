import { Role } from '@things-factory/auth-base'
import { csvHeaderCamelizer, Domain } from '@things-factory/shell'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'

const csvFilePath = '../../seeds/role.csv'

export class SeedRole1563435582792 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const roles = await csvHeaderCamelizer(path.resolve(__dirname, csvFilePath))

    for (let i = 0; i < roles.length; i++) {
      const role = roles[i]
      role.domain = await getRepository(Domain).findOne({ name: role.domainName })
    }

    try {
      await getRepository(Role).save(roles)
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
