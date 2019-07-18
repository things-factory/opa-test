import { Role } from '@things-factory/auth-base'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'
import { csvToJson } from '../seed-data/csv-to-json'

const csvFilePath = '../seed-data/role.csv'

export class SeedRole1563435582792 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const json = await csvToJson(path.resolve(__dirname, csvFilePath))

    try {
      await getRepository(Role)
        .createQueryBuilder()
        .insert()
        .into(Role)
        .values(json)
        .execute()
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const json = await csvToJson(path.resolve(__dirname, csvFilePath))

    try {
      await getRepository(Role)
        .createQueryBuilder()
        .delete()
        .from(Role)
        .where('name IN (:...name)', json.map(record => record.name))
        .execute()
    } catch (e) {
      console.error(e)
    }
  }
}
