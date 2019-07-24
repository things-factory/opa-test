import { Role, User } from '@things-factory/auth-base'
import path from 'path'
import { getRepository, IsNull, MigrationInterface, Not, QueryRunner } from 'typeorm'
import { csvHeaderCamelizer } from '@things-factory/shell'

const csvFilePath = '../../seeds/user.csv'

export class SeedUser1563436471480 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const userRepository = getRepository(User)
    const roleRepository = getRepository(Role)
    const json = await csvHeaderCamelizer(path.resolve(__dirname, csvFilePath))

    for (let i = 0; i < json.length; i++) {
      const record = json[i]
      if (record.userType.toLowerCase() === 'admin') {
        record.roles = [await roleRepository.findOne({ where: { name: 'Owner' } })]
      } else if (record.userType.toLowerCase() === 'client') {
        record.roles = [await roleRepository.findOne({ where: { name: 'Client' } })]
      } else if (record.userType.toLowerCase() === 'operator') {
        record.roles = [await roleRepository.findOne({ where: { name: 'Operator' } })]
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
    const json = await csvHeaderCamelizer(path.resolve(__dirname, csvFilePath))

    try {
      await getRepository(User)
        .createQueryBuilder()
        .delete()
        .from(User)
        .where('name in (:...names)', json.map((record: User) => record.name))
        .execute()
    } catch (e) {
      console.error(e)
    }
  }
}
