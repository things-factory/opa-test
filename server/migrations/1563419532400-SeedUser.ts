import { User, Role } from '@things-factory/auth-base'
import { Bizplace } from '@things-factory/biz-base'
import { Domain } from '@things-factory/shell'
import { getRepository, MigrationInterface, QueryRunner, In, Transaction } from 'typeorm'

const SEED_USERS = [
  {
    name: 'ACT Admin',
    email: 'admin@act.com',
    password: '1234',
    domainName: 'KIMEDA',
    bizplaceNames: ['Advance Chemical Trading'],
    roleName: 'Super Admin'
  },
  {
    name: 'KIMEDA Admin',
    email: 'admin@kimeda.com',
    password: '1234',
    domainName: 'KIMEDA',
    bizplaceNames: ['Kimeda Sdn Bhd'],
    roleName: 'Super Admin'
  }
]

export class SeedUser1563419532400 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    try {
      for (let i = 0; i < SEED_USERS.length; i++) {
        const user: User = SEED_USERS[i]
        const domain = await getRepository(Domain).findOne({ name: user.domainName })

        const newUser = await getRepository(User).save({
          ...user,
          domain,
          password: User.encode(user.password)
        })

        const bizplaces = await getRepository(Bizplace).find({
          where: {
            domain,
            name: In(user.bizplaceNames)
          },
          relations: ['users']
        })

        for (let j = 0; j < bizplaces.length; j++) {
          const bizplace: Bizplace = bizplaces[j]
          await getRepository(Bizplace).save({
            ...bizplace,
            users: [...bizplace.users, newUser]
          })
        }
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
