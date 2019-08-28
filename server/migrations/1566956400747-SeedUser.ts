import { MigrationInterface, QueryRunner, getRepository } from 'typeorm'
import { User } from '@things-factory/auth-base'
import { Domain } from '@things-factory/shell'

const SEED_USERS = [
  {
    name: 'Admin',
    email: 'admin@act.com',
    password: '1234',
    userType: 'admin'
  },
  {
    name: 'Admin',
    email: 'admin@kimeda.com',
    password: '1234',
    userType: 'admin'
  }
]

export class SeedUser1566956400747 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(User)
    const domain = await getRepository(Domain).findOne({ where: { name: 'KIMEDA' } })

    try {
      for (let i = 0; i < SEED_USERS.length; i++) {
        const user = SEED_USERS[i]
        await repository.save({
          domain,
          ...user,
          password: User.encode(user.password)
        })
      }
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
