import { Bizplace, Company } from '@things-factory/biz-base'
import { csvHeaderCamelizer, Domain } from '@things-factory/shell'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'

const seedFilePath = '../../seeds/bizplace.csv'

export class SeedBizplaces1574252889594 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const bizplaces = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))

    for (let i = 0; i < bizplaces.length; i++) {
      const bizplace = bizplaces[i]
      bizplace.company = await getRepository(Company).findOne({ name: bizplace.companyName })
      bizplace.domain = await getRepository(Domain).findOne({ name: bizplace.domainName })
    }

    try {
      await getRepository(Bizplace).save(bizplaces)
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const json = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))

    try {
      await getRepository(Bizplace)
        .createQueryBuilder()
        .delete()
        .from(Bizplace)
        .where('name IN (:...names)', { names: json.map((record: any) => record.name) })
        .execute()
    } catch (e) {
      console.error(e)
    }
  }
}
