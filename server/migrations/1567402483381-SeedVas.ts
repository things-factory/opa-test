import { Vas } from '@things-factory/sales-base'
import { csvHeaderCamelizer, Domain } from '@things-factory/shell'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'

const seedFilePath = '../../seeds/vas.csv'

export class SeedVas1567402483381 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const vass = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))

    for (let i = 0; i < vass.length; i++) {
      const vas = vass[i]

      vas.domain = await getRepository(Domain).findOne({
        where: { name: vas.domainName }
      })
    }

    try {
      await getRepository(Vas).save(vass)
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const vass = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))

    try {
      await getRepository(Vas)
        .createQueryBuilder()
        .delete()
        .from(Vas)
        .where('name IN (:...names)', { names: vass.map(vas => vas.name) })
        .execute()
    } catch (e) {
      console.error(e)
    }
  }
}
