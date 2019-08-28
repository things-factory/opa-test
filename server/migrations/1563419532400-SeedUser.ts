import { User } from '@things-factory/auth-base'
import { Domain } from '@things-factory/shell'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'

const SEED_USERS = [
  {
    name: 'ACT Admin',
    email: 'admin@act.com',
    password: '1234',
    domainName: 'KIMEDA'
  },
  {
    name: 'KIMEDA Admin',
    email: 'admin@kimeda.com',
    password: '1234',
    domainName: 'KIMEDA'
  }
]

export class SeedUser1563419532400 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    for (let i = 0; i < SEED_USERS.length; i++) {
      const user: User = SEED_USERS[i]
      ;(user.domain = await getRepository(Domain).findOne({ name: user.domainName })),
        (user.password = User.encode(user.password))
    }

    try {
      await getRepository(User).save(SEED_USERS)
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(User)

    SEED_USERS.reverse().forEach(async user => {
      let record = await repository.findOne({ email: user.email })
      await repository.remove(record)
    })
  }
}
