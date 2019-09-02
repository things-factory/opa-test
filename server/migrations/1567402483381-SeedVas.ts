import { Bizplace } from '@things-factory/biz-base'
import { Vas } from '@things-factory/sales-base'
import { csvHeaderCamelizer } from '@things-factory/shell'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'

const seedFilePath = '../../seeds/vas.csv'

export class SeedVas1567402483381 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const vass = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))

    for (let i = 0; i < vass.length; i++) {
      const vas = vass[i]
      vas.bizplace = await getRepository(Bizplace).findOne({
        where: { name: vas.bizplaceName },
        relations: ['domain']
      })

      vas.domain = vas.bizplace.domain
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
