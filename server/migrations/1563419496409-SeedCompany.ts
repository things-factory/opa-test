import { Bizplace, Company } from '@things-factory/biz-base'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'
import { csvHeaderCamelizer } from '@things-factory/shell'

const seedFilePath = '../../seeds/company.csv'

export class SeedCompany1563419496409 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const json = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))

    try {
      await getRepository(Company)
        .createQueryBuilder()
        .insert()
        .into(Company)
        .values(json)
        .execute()
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const json = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))

    try {
      await getRepository(Company)
        .createQueryBuilder()
        .delete()
        .from(Company)
        .where('name IN (:...names)', { names: json.map(record => record.name) })
        .execute()
    } catch (e) {
      console.error(e)
    }
  }
}
