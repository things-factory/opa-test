import { MigrationInterface, QueryRunner, getRepository } from 'typeorm'
import { Domain } from '@things-factory/shell'

const SEED_DOMAINS = [
  {
    name: 'KIMEDA',
    subdomain: 'kimeda',
    systemFlag: true
  }
]

export class SeedDomain1566956187245 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Domain)

    try {
      SEED_DOMAINS.forEach(async domain => {
        await repository.save({
          ...domain
        })
      })
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Domain)

    SEED_DOMAINS.reverse().forEach(async domain => {
      let recode = await repository.findOne({ name: domain.name })
      await repository.remove(recode)
    })
  }
}
