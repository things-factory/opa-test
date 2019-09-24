import { Bizplace } from '@things-factory/biz-base'
import { Product } from '@things-factory/sales-base'
import { csvHeaderCamelizer } from '@things-factory/shell'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'

// const seedFilePath = '../../seeds/product.csv'

export class SeedProduct1563446367842 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    // const products = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))
    // for (let i = 0; i < products.length; i++) {
    //   const product = products[i]
    //   product.bizplace = await getRepository(Bizplace).findOne({
    //     where: { name: product.bizplaceName },
    //     relations: ['domain']
    //   })
    //   product.domain = product.bizplace.domain
    // }
    // try {
    //   await getRepository(Product).save(products)
    // } catch (e) {
    //   console.error(e)
    // }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // const products = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))
    // try {
    //   await getRepository(Product)
    //     .createQueryBuilder()
    //     .delete()
    //     .from(Product)
    //     .where('name IN (:...names)', { names: products.map(product => product.name) })
    //     .execute()
    // } catch (e) {
    //   console.error(e)
    // }
  }
}
