import { Domain } from '@things-factory/shell'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'

const SEED_DOMAINS = [
  {
    name: 'KIMEDA',
    subdomain: 'kimeda'
  }
]

export class SeedDomain1100000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    try {
      await getRepository(Domain).save(SEED_DOMAINS)
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
