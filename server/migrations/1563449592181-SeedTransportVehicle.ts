import { Bizplace } from '@things-factory/biz-base'
import { csvHeaderCamelizer, Domain } from '@things-factory/shell'
import { TransportVehicle } from '@things-factory/transport-base'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'

const seedFilePath = '../../seeds/transport-vehicle.csv'

export class SeedTransportVehicle1563449592181 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const transportVehicles = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))

    for (let i = 0; i < transportVehicles.length; i++) {
      const transportVehicle = transportVehicles[i]
      transportVehicle.name = `${transportVehicle.regNumber}`

      transportVehicle.bizplace = await getRepository(Bizplace).findOne({
        where: { name: transportVehicle.bizplaceName },
        relations: ['domain']
      })

      transportVehicle.domain = await getRepository(Domain).findOne(transportVehicle.bizplace.domain.id)
    }

    try {
      await getRepository(TransportVehicle).save(transportVehicles)
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const transportVehicles = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))

    try {
      await getRepository(TransportVehicle)
        .createQueryBuilder()
        .delete()
        .from(TransportVehicle)
        .where('name IN (:...names)', { names: transportVehicles.map(transportVehicle => transportVehicle.name) })
        .execute()
    } catch (e) {
      console.error(e)
    }
  }
}
