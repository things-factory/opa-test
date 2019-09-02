import { Role, User } from '@things-factory/auth-base'
import { csvHeaderCamelizer, Domain } from '@things-factory/shell'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'

const csvFilePath = '../../seeds/user-role.csv'

export class SeedUserRole1567409059290 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const userRoles = await csvHeaderCamelizer(path.resolve(__dirname, csvFilePath))

    for (let i = 0; i < userRoles.length; i++) {
      const userRole = userRoles[i]
      const user: User = await getRepository(User).findOne({
        where: {
          email: userRole.email
        }
      })

      const role: Role = await getRepository(Role).findOne({
        where: {
          domain: await getRepository(Domain).findOne({
            where: {
              name: userRole.domainName
            }
          }),
          name: userRole.roleName
        }
      })

      await getRepository(Role).query(
        `
            INSERT INTO
                users_roles (users_id, roles_id)
            VALUES
                ('${user.id}', '${role.id}')
          `
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
