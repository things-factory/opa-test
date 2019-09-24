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
      model: `{"width":800,"height":320,"type":"model-layer","translate":{"x":0,"y":194.57500000000002},"scale":{"x":1.13875,"y":1.13875},"fillStyle":"#fff","left":0,"top":0,"components":[{"type":"barcode","symbol":"qrcode","text":"","left":136.82617391680537,"top":40.40134661113845,"width":239.9999999999999,"height":239.99999999999997,"rotation":0,"id":"location","mappings":[{"target":"(self)","rule":"value","property":"text"},{"target":"#location-text","rule":"value","property":"text"}],"data":"X"},{"type":"text","left":430.96558082120083,"top":50.73156868796167,"width":273.3853924552041,"height":190.54175732740606,"text":"","fillStyle":"#fff","strokeStyle":"#000","alpha":1,"hidden":false,"lineWidth":5,"lineCap":"butt","textAlign":"center","textBaseline":"middle","textWrap":false,"fontFamily":"serif","fontSize":"240","rotation":0,"id":"shelf","mappings":[{"target":"(self)","rule":"value","property":"text"}],"data":"X"},{"type":"text","left":400.1244575004591,"top":231.74955369524707,"width":335.0676390966875,"height":67.61565836298934,"text":"","fillStyle":"#fff","strokeStyle":"#000","alpha":1,"hidden":false,"lineWidth":5,"lineCap":"butt","textAlign":"center","textBaseline":"middle","textWrap":false,"fontFamily":"serif","fontSize":"60","rotation":0,"mappings":[{"target":"(self)","rule":"value","property":"text"}],"data":"X","id":"location-text"}]}`,
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
