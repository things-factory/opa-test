import { Menu } from '@things-factory/menu-base'
import { Domain } from '@things-factory/shell'
import path from 'path'
import { getRepository, In, MigrationInterface, QueryRunner } from 'typeorm'
import { csvHeaderCamelizer } from '@things-factory/shell'

const menuGroupCsvFilePath = '../../seeds/menu-group.csv'
const menuCsvFilePath = '../../seeds/menu.csv'

export class SeedMenu1563440874637 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const menuGroups = await csvHeaderCamelizer(path.resolve(__dirname, menuGroupCsvFilePath))
    const menus = await csvHeaderCamelizer(path.resolve(__dirname, menuCsvFilePath))
    const domains = await getRepository(Domain).find()
    const repository = getRepository(Menu)

    try {
      for (let i = 0; i < menuGroups.length; i++) {
        const menuGroup = menuGroups[i]

        for (let j = 0; j < domains.length; j++) {
          const domain = domains[j]
          await repository.save({
            domain,
            ...menuGroup,
            hiddenFlag: JSON.parse(menuGroup.hiddenFlag)
          })
        }
      }
      for (let i = 0; i < menus.length; i++) {
        const menu = menus[i]

        for (let j = 0; j < domains.length; j++) {
          const domain = domains[j]
          await repository.save({
            domain,
            ...menu,
            parent: await repository.findOne({ name: menu.groupName }),
            hiddenFlag: JSON.parse(menu.hiddenFlag)
          })
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const menuGroups = await csvHeaderCamelizer(path.resolve(__dirname, menuGroupCsvFilePath))
    const menus = await csvHeaderCamelizer(path.resolve(__dirname, menuCsvFilePath))
    const domain = await getRepository(Domain).findOne({ name: 'OPA' })
    const repository = getRepository(Menu)

    try {
      await repository.delete({ domain, name: In(menus.map(menu => menu.name)) })
      await repository.delete({ domain, name: In(menuGroups.map(menuGroup => menuGroup.name)) })
    } catch (e) {
      console.error(e)
    }
  }
}
