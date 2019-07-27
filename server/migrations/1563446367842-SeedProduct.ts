import { Company } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'
import { Domain, csvHeaderCamelizer } from '@things-factory/shell'

const seedFilePath = '../../seeds/product.csv'

export class SeedProduct1563446367842 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const products = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))

    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      product.domain = await getRepository(Domain).findOne({ where: { name: 'SYSTEM' } })
      product.company = await getRepository(Company).findOne({ where: { name: product.companyName } })
    }

    try {
      await getRepository(Product).save(products)
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const products = await csvHeaderCamelizer(path.resolve(__dirname, seedFilePath))

    try {
      await getRepository(Product)
        .createQueryBuilder()
        .delete()
        .from(Product)
        .where('name IN (:...names)', { names: products.map(product => product.name) })
        .execute()
    } catch (e) {
      console.error(e)
    }
  }
}
