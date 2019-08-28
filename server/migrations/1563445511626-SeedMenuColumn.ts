import { Menu, MenuColumn } from '@things-factory/menu-base'
import { csvHeaderCamelizer, Domain } from '@things-factory/shell'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'

const seedFilePath = '../../seeds/menu-column.csv'

export class SeedMenuColumn1563445511626 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const menuColumns = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))
    const domains = await getRepository(Domain).find()

    try {
      for (let i = 0; i < domains.length; i++) {
        const domain = domains[i]

        for (let j = 0; j < menuColumns.length; j++) {
          const menuColumn = menuColumns[j]
          menuColumn.domain = domain
          menuColumn.menu = await getRepository(Menu).findOne({ name: menuColumn.menuName })

          await getRepository(MenuColumn).save({
            ...menuColumn
          })
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const menuColumns = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))
    const domain: Domain = await getRepository(Domain).findOne({ where: { name: 'SYSTEM' } })

    try {
      await getRepository(MenuColumn)
        .createQueryBuilder()
        .delete()
        .from(MenuColumn)
        .where('name in (:...names)', menuColumns.map((menuColumn: MenuColumn) => menuColumn.name))
        .andWhere('domain_id = :domainId', domain.id)
        .execute()
    } catch (e) {
      console.error(e)
    }
  }
}
