import { Bizplace } from '@things-factory/biz-base'
import { csvHeaderCamelizer, Domain } from '@things-factory/shell'
import { TransportDriver } from '@things-factory/transport-base'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'

const seedFilePath = '../../seeds/transport-driver.csv'

export class SeedTransportDriver1563449576533 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const transportDrivers = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))

    for (let i = 0; i < transportDrivers.length; i++) {
      const transportDriver = transportDrivers[i]
      transportDriver.bizplace = await getRepository(Bizplace).findOne({
        where: { name: transportDriver.bizplaceName },
        relations: ['domain']
      })

      transportDriver.domain = transportDriver.bizplace.domain
    }

    try {
      await getRepository(TransportDriver).save(transportDrivers)
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const transportDrivers = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))

    try {
      await getRepository(TransportDriver)
        .createQueryBuilder()
        .delete()
        .from(TransportDriver)
        .where('name IN (:...names)', { names: transportDrivers.map(transportDriver => transportDriver.name) })
        .execute()
    } catch (e) {
      console.error(e)
    }
  }
}
