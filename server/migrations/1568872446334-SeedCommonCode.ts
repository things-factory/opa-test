import { MigrationInterface, QueryRunner, getRepository } from 'typeorm'
import { CommonCode, CommonCodeDetail } from '@things-factory/code-base'
import { Domain } from '@things-factory/shell'

const commonCodes = [
  {
    name: 'LOCATION_TYPE',
    description: 'Location type',
    commonCodeDetails: [
      { name: 'BUFFER', description: 'buffer_location' },
      { name: 'SHELF', description: 'shelf' }
    ]
  },
  {
    name: 'ORDER_STATUS',
    description: 'Order status',
    commonCodeDetails: [
      { name: 'PENDING', description: 'order_status_pending' },
      { name: 'EDITING', description: 'order_status_editing' },
      { name: 'PENDING_RECEIVE', description: 'order_status_pending_receive' },
      { name: 'INTRANSIT', description: 'order_status_intransit' },
      { name: 'ARRIVED', description: 'order_status_arrived' },
      { name: 'PROCESSING', description: 'order_status_processing' },
      { name: 'DONE', description: 'order_status_done' }
    ]
  },
  {
    name: 'ORDER_PRODUCT_STATUS',
    description: 'Order Product status',
    commonCodeDetails: [
      { name: 'PENDING', description: 'product_status_pending' },
      { name: 'INTRANSIT', description: 'product_status_intransit' },
      { name: 'ARRIVED', description: 'product_status_arrived' },
      { name: 'UNLOADING', description: 'product_status_unloading' },
      { name: 'UNLOADED', description: 'product_status_unloaded' },
      { name: 'PUTTING AWAY', description: 'product_status_putting_away' },
      { name: 'STORED', description: 'product_status_stored' }
    ]
  },
  {
    name: 'ORDER_VAS_STATUS',
    description: 'Order Vas status',
    commonCodeDetails: [
      { name: 'PENDING', description: 'vas_status_pending' },
      { name: 'PROCESSING', description: 'vas_status_processing' }
    ]
  },
  {
    name: 'LOAD_TYPES',
    description: 'Load types',
    commonCodeDetails: [
      { name: 'FCL', description: 'full_container_load' },
      { name: 'LCL', description: 'low_container_load' },
      { name: 'TAG_ALONG', description: 'tag_along_load' }
    ]
  },
  {
    name: 'CARGO_TYPES',
    description: 'Cargo types',
    commonCodeDetails: [
      { name: 'BAG', description: 'bag_cargo' },
      { name: 'CARTON', description: 'carton_cargo' },
      { name: 'IBC', description: 'ibc_cargo' },
      { name: 'DRUMS', description: 'drums_cargo' },
      { name: 'PAIL', description: 'pail_cargo' },
      { name: 'CRATES', description: 'crates_cargo' },
      { name: 'OTHERS', description: 'others_cargo' }
    ]
  },
  {
    name: 'WORKSHEET_TYPES',
    description: 'worksheet types',
    commonCodeDetails: [
      { name: 'UNLOADING', description: 'unloading' },
      { name: 'PUTAWAY', description: 'putaway' },
      { name: 'VAS', description: 'VAS' },
      { name: 'LOADING', description: 'loading' },
      { name: 'PICKING', description: 'picking' }
    ]
  },
  {
    name: 'WORKSHEET_STATUS',
    description: 'worksheet status',
    commonCodeDetails: [
      { name: 'DEACTIVATED', description: 'deactivated' },
      { name: 'EXECUTING', description: 'executing' },
      { name: 'DONE', description: 'done' }
    ]
  },
  {
    name: 'WEIGHT_UNITS',
    description: 'Unit for weight',
    commonCodeDetails: [
      { name: 'kg', description: 'kilogram' },
      { name: 't', description: 'ton' }
    ]
  },
  {
    name: 'PACKING_TYPES',
    description: 'Types of packing',
    commonCodeDetails: [
      { name: 'CORRUGATED_BOX', description: 'Corrugated box packing' },
      { name: 'CARTON', description: 'Carton packing' },
      { name: 'DRUM', description: 'Drum packing' },
      { name: 'BOTTLE', description: 'Bottle packing' },
      { name: 'BAG', description: 'Bag packing' },
      { name: 'SACK', description: 'Sack packing' },
      { name: 'BOXBOARD', description: 'Boxboard packing' },
      { name: 'CAN', description: 'Can packing' }
    ]
  },
  {
    name: 'TRANSPORT_TYPES',
    description: 'Types of transport',
    commonCodeDetails: [
      { name: 'DELIVERY', description: 'Provide delivery service' },
      { name: 'COLLECTION', description: 'Provide collection service' }
    ]
  }
]

export class SeedCommonCode1568872446334 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const domain = await getRepository(Domain).findOne({ where: { name: 'ELCC' } })

    commonCodes.forEach(async commonCode => {
      const newCommonCode = await getRepository(CommonCode).save({
        ...commonCode,
        domain
      })

      await getRepository(CommonCodeDetail).insert(
        commonCode.commonCodeDetails.map((commonCodeDetail, index) => {
          return {
            ...commonCodeDetail,
            rank: (index + 1) * 10,
            commonCode: newCommonCode,
            domain
          }
        })
      )
    })
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
