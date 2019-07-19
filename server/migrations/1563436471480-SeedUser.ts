import { Role, User } from '@things-factory/auth-base'
import path from 'path'
import { getRepository, IsNull, MigrationInterface, Not, QueryRunner } from 'typeorm'
import { csvToJson } from '../seed-data/csv-to-json'

const csvFilePath = '../seed-data/user.csv'

export class SeedUser1563436471480 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const userRepository = getRepository(User)
    const json = await csvToJson(path.resolve(__dirname, csvFilePath))

    for (let i = 0; i < json.length; i++) {
      const roleRepository = getRepository(Role)
      const record = json[i]
      if (record.userType === 'admin') {
        record.roles = [await roleRepository.findOne({ where: { name: 'Owner' } })]
      } else {
        record.roles = [await roleRepository.findOne({ where: { name: 'Client' } })]
      }

      record.password = User.encode(record.password)
    }

    try {
      await userRepository.save(json)
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const json = await csvToJson(path.resolve(__dirname, csvFilePath))

    try {
      await getRepository(User)
        .createQueryBuilder()
        .delete()
        .from(User)
        .where('name in (:...names)', json.map(record => record.name))
        .execute()
    } catch (e) {
      console.error(e)
    }
  }
}
