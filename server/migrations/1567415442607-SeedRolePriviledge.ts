import { Role, Priviledge } from '@things-factory/auth-base'
import { csvHeaderCamelizer, Domain } from '@things-factory/shell'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'

const csvFilePath = '../../seeds/role-priviledge.csv'

export class SeedRolePriviledge1567415442607 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const rolePriviledges = await csvHeaderCamelizer(path.resolve(__dirname, csvFilePath))

    for (let i = 0; i < rolePriviledges.length; i++) {
      const rolePriviledge = rolePriviledges[i]
      const role: Role = await getRepository(Role).findOne({
        where: {
          name: rolePriviledge.roleName
        }
      })

      const priviledge: Priviledge = await getRepository(Priviledge).findOne({
        where: {
          domain: await getRepository(Domain).findOne({
            where: {
              name: rolePriviledge.domainName
            }
          }),
          name: rolePriviledge.priviledgeName,
          category: rolePriviledge.priviledgeCategory
        }
      })

      await getRepository(Priviledge).query(
        `
            INSERT INTO
                roles_priviledges (roles_id, priviledges_id)
            VALUES
                ('${role.id}', '${priviledge.id}')
          `
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
