import { Company } from '@things-factory/biz-base'
import { csvHeaderCamelizer } from '@things-factory/shell'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'

const seedFilePath = '../../seeds/company.csv'

export class SeedCompany1563419496409 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const companies = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))

    try {
      await getRepository(Company).save(companies)
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const companies = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))

    try {
      await getRepository(Company)
        .createQueryBuilder()
        .delete()
        .from(Company)
        .where('name IN (:...names)', { names: companies.map(company => company.name) })
        .execute()
    } catch (e) {
      console.error(e)
    }
  }
}
