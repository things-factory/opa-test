import { TransportVehicle } from '@things-factory/transport-base'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'
import { Domain, csvHeaderCamelizer } from '@things-factory/shell'

const seedFilePath = '../../seeds/transport-vehicle.csv'

export class SeedTransportVehicle1563449592181 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const transportVehicles = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))

    for (let i = 0; i < transportVehicles.length; i++) {
      const transportVehicle = transportVehicles[i]
      transportVehicle.domain = await getRepository(Domain).findOne({ where: { name: 'SYSTEM' } })
      console.log(transportVehicle)
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
