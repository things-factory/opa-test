import { MigrationInterface, QueryRunner, getRepository } from 'typeorm'
import { Domain } from '@things-factory/shell'
import { Menu } from '@things-factory/menu-base'
import { Board, PlayGroup } from '@things-factory/board-base'

export class SeedBoardMenu1564115337291 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Menu)
    const domainRepository = getRepository(Domain)
    const domain = await domainRepository.findOne({ name: 'SYSTEM' })

    const boardRepository = getRepository(Board)
    const boards: Board[] = await boardRepository.find({
      domain
    })

    const playGroupRepository = getRepository(PlayGroup)
    const playGroups: PlayGroup[] = await playGroupRepository.find({
      domain
    })

    try {
      const viewerMenus = boards.map(board => {
        return {
          hiddenFlag: false,
          name: board.name,
          description: board.description,
          idField: 'resourceName',
          titleField: 'resourceName',
          resourceName: board.id,
          routingType: 'VIEWER',
          rank: 100,
          menuType: 'SCREEN',
          category: 'STANDARD',
          resourceType: 'BOARD'
        }
      })

      const playerMenus = playGroups.map(group => {
        return {
          hiddenFlag: false,
          name: group.name,
          description: group.description,
          idField: 'resourceName',
          titleField: 'resourceName',
          resourceName: group.id,
          routingType: 'PLAYER',
          rank: 100,
          menuType: 'SCREEN',
          category: 'STANDARD',
          resourceType: 'BOARD'
        }
      })

      var menu = {
        // fixedColumns: 0,
        hiddenFlag: false,
        pagination: false,
        name: 'DashBoard',
        rank: 20000,
        menuType: 'MENU',
        category: 'STANDARD'
      }

      const parent = await repository.save({ ...menu, domain })

      viewerMenus.forEach(async menu => {
        await repository.save({
          ...menu,
          domain,
          parent
        })
      })

      playerMenus.forEach(async menu => {
        await repository.save({
          ...menu,
          domain,
          parent
        })
      })
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Menu)

    // TODO remove board menus
    // SEED_MENU.reverse().forEach(async menu => {
    //   let record = await repository.findOne({ name: menu.name })
    //   await repository.remove(record)
    // })
  }
}
