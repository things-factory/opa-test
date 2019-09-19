import { MigrationInterface, QueryRunner, getRepository } from 'typeorm'
import { CommonCode, CommonCodeDetail } from '@things-factory/code-base'
import { Domain } from '@things-factory/shell'

const commonCodes = [
  {
    name: 'LOCATION_TYPE',
    description: 'Location type',
    commonCodeDetails: [
      {
        name: 'BUFFER',
        description: 'buffer_location'
      },
      {
        name: 'SHELF',
        description: 'shelf'
      }
    ]
  },
  {
    name: 'ORDER_STATUS',
    description: 'Order status',
    commonCodeDetails: [
      {
        name: 'PENDING',
        description: 'order_status_pending'
      },
      {
        name: 'EDITING',
        description: 'order_status_editing'
      },
      {
        name: 'PENDING_RECEIVE',
        description: 'order_status_pending_receive'
      },
      {
        name: 'INTRANSIT',
        description: 'order_status_intransit'
      },
      {
        name: 'ARRIVED',
        description: 'order_status_arrived'
      },
      {
        name: 'PROCESSING',
        description: 'order_status_processing'
      },
      {
        name: 'DONE',
        description: 'order_status_done'
      }
    ]
  },
  {
    name: 'ORDER_PRODUCT_STATUS',
    description: 'Order Product status',
    commonCodeDetails: [
      {
        name: 'PENDING',
        description: 'product_status_pending'
      },
      {
        name: 'INTRANSIT',
        description: 'product_status_intransit'
      },
      {
        name: 'ARRIVED',
        description: 'product_status_arrived'
      },
      {
        name: 'UNLOADING',
        description: 'product_status_unloading'
      },
      {
        name: 'UNLOADED',
        description: 'product_status_unloaded'
      },
      {
        name: 'PUTTING AWAY',
        description: 'product_status_putting_away'
      },
      {
        name: 'STORED',
        description: 'product_status_stored'
      }
    ]
  },
  {
    name: 'ORDER_VAS_STATUS',
    description: 'Order Vas status',
    commonCodeDetails: [
      {
        name: 'PENDING',
        description: 'vas_status_pending'
      },
      {
        name: 'PROCESSING',
        description: 'vas_status_processing'
      }
    ]
  },
  {
    name: 'LOAD_TYPES',
    description: 'Load types',
    commonCodeDetails: [
      {
        name: 'FCL',
        description: 'full_container_load'
      },
      {
        name: 'LCL',
        description: 'low_container_load'
      }
    ]
  },
  {
    name: 'WORKSHEET_TYPES',
    description: 'worksheet types',
    commonCodeDetails: [
      {
        name: 'UNLOADING',
        description: 'unloading'
      },
      {
        name: 'PUTAWAY',
        description: 'putaway'
      },
      {
        name: 'VAS',
        description: 'VAS'
      },
      {
        name: 'LOADING',
        description: 'laoding'
      },
      {
        name: 'PICKING',
        description: 'picking'
      }
    ]
  },
  {
    name: 'WORKSHEET_STATUS',
    description: 'worksheet status',
    commonCodeDetails: [
      {
        name: 'DEACTIVATED',
        description: 'deactivated'
      },
      {
        name: 'EXECUTING',
        description: 'executing'
      },
      {
        name: 'DONE',
        description: 'done'
      }
    ]
  }
]

export class SeedCommonCode1568872446334 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    commonCodes.forEach(async commonCode => {
      const newCommonCode = await getRepository(CommonCode).save({
        ...commonCodes,
        domain: await getRepository(Domain).findOne({ where: { name: 'KIMEDA' } })
      })

      await getRepository(CommonCodeDetail).insert(
        commonCode.commonCodeDetails.map(async (commonCodeDetail, index) => {
          return {
            ...commonCodeDetail,
            rank: (index + 1) * 10,
            commonCode: newCommonCode,
            domain: await getRepository(Domain).findOne({ where: { name: 'KIMEDA' } })
          }
        })
      )
    })
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}