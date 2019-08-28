import { Menu } from '@things-factory/menu-base'
import { csvHeaderCamelizer, Domain } from '@things-factory/shell'
import path from 'path'
import { getRepository, In, MigrationInterface, QueryRunner } from 'typeorm'

const menuGroupCsvFilePath = '../../seeds/menu-group.csv'
const menuCsvFilePath = '../../seeds/menu.csv'

export class SeedMenu1563440874637 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const menuGroups = await csvHeaderCamelizer(path.resolve(__dirname, menuGroupCsvFilePath))
    const menus = await csvHeaderCamelizer(path.resolve(__dirname, menuCsvFilePath))
    const domains = await getRepository(Domain).find()

    try {
      for (let i = 0; i < domains.length; i++) {
        const domain = domains[i]

        for (let j = 0; j < menuGroups.length; j++) {
          const menuGroup = menuGroups[j]
          menuGroup.domain = domain
          menuGroup.hiddenFlag = JSON.parse(menuGroup.hiddenFlag)

          await getRepository(Menu).save({
            ...menuGroup
          })
        }
      }

      for (let i = 0; i < domains.length; i++) {
        const domain = domains[i]

        for (let j = 0; j < menus.length; j++) {
          const menu = menus[j]
          menu.domain = domain
          menu.parent = await getRepository(Menu).findOne({ name: menu.groupName, domain })
          menu.hiddenFlag = JSON.parse(menu.hiddenFlag)

          await getRepository(Menu).save({
            ...menu
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
