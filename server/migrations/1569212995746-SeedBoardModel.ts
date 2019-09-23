import { MigrationInterface, QueryRunner } from 'typeorm'
import { getRepository } from 'typeorm'
import { Domain } from '@things-factory/shell'
import { Group, Board } from '@things-factory/board-service'

const SEED_GROUP = [
  {
    name: 'DASHBOARD',
    description: 'Dashboard'
  },
  {
    name: 'LABEL',
    description: 'LABEL'
  }
]

const BOARDS = {
  DASHBOARD: [],
  LABEL: [
    {
      name: 'LOCATION',
      description: 'Location Label Model',
      model: `{"width": 400, "height": 300}`,
      thumbnail: ''
    },
    {
      name: 'PALLET',
      description: 'Pallet Label Model',
      model: `{"width": 400, "height": 300}`,
      thumbnail: ''
    }
  ]
}

export class SeedBoardModel1569212995746 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const groupRepository = getRepository(Group)
    const boardRepository = getRepository(Board)
    const domainRepository = getRepository(Domain)
    const domain = await domainRepository.findOne({ name: 'KIMEDA' })

    try {
      SEED_GROUP.forEach(async group => {
        var group$ = await groupRepository.save({
          ...group,
          domain
        })

        BOARDS[group.name].forEach(async model => {
          await boardRepository.save({
            ...model,
            group: group$,
            domain
          })
        })
      })
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Group)
    const domainRepository = getRepository(Domain)
    const domain = await domainRepository.findOne({ name: 'KIMEDA' })

    SEED_GROUP.reverse().forEach(async group => {
      let record = await repository.findOne({ name: group.name, domain })
      await repository.remove(record)
    })
  }
}
