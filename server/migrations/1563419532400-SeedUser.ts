import { User, Role } from '@things-factory/auth-base'
import { Bizplace, BizplaceUser } from '@things-factory/biz-base'
import { Domain } from '@things-factory/shell'
import { getRepository, MigrationInterface, QueryRunner, In, Transaction } from 'typeorm'

const SEED_USERS = [
  {
    name: 'ACT Admin',
    email: 'admin@act.com',
    password: '1234',
    domainName: 'ELCC',
    bizplaces: [
      {
        name: 'Advance Chemical Trading',
        mainBizplace: true
      }
    ],
    roleName: 'Super Admin'
  },
  {
    name: 'ELCC Admin',
    email: 'admin@elcc.com',
    password: '1234',
    domainName: 'ELCC',
    bizplaces: [
      {
        name: 'ELCC Sdn Bhd',
        mainBizplace: true
      },
      {
        name: 'Advance Chemical Trading'
      }
    ],
    roleName: 'Super Admin'
  }
]

export class SeedUser1563419532400 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    try {
      for (let i = 0; i < SEED_USERS.length; i++) {
        const user: any = SEED_USERS[i]
        const domain = await getRepository(Domain).findOne({ name: user.domainName })
        const domains = [domain]

        const newUser = await getRepository(User).save({
          ...user,
          domain,
          domains,
          activated: true,
          password: User.encode(user.password)
        })

        const bizplaces = await getRepository(Bizplace).find({
          where: {
            domain,
            name: In(user.bizplaces.map((bizplace: Bizplace) => bizplace.name))
          },
          relations: ['users']
        })

        bizplaces.forEach(async (bizplace: Bizplace) => {
          await getRepository(BizplaceUser).insert({
            bizplace,
            user: newUser,
            mainBizplace: user.bizplaces.filter((userBizplace: any) => userBizplace.name === bizplace.name)[0]
              .mainBizplace
          })
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
