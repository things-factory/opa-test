import { Menu } from '@things-factory/menu-base'
import { Domain } from '@things-factory/shell'
import path from 'path'
import { getRepository, In, MigrationInterface, QueryRunner } from 'typeorm'
import { csvToJson } from '../seed-data/csv-to-json'

const menuGroupCsvFilePath = '../seed-data/menu-group.csv'
const menuCsvFilePath = '../seed-data/menu.csv'

export class SeedMenu1563440874637 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const menuGroups = await csvToJson(path.resolve(__dirname, menuGroupCsvFilePath))
    const menus = await csvToJson(path.resolve(__dirname, menuCsvFilePath))
    const domain = await getRepository(Domain).findOne({ name: 'OPA' })
    const repository = getRepository(Menu)

    try {
      await repository.save(menuGroups)

      for (let i = 0; i < menus.length; i++) {
        const menu = menus[i]
        await repository.save({
          ...menu,
          domain,
          parent: await repository.findOne({ name: menu.groupName })
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const menuGroups = await csvToJson(path.resolve(__dirname, menuGroupCsvFilePath))
    const menus = await csvToJson(path.resolve(__dirname, menuCsvFilePath))
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
