import { Bizplace } from '@things-factory/biz-base'
import csv from 'csvtojson'
import _ from 'lodash'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'

export class SeedBizplace1563352365741 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Bizplace)
    const json = await csvToJson(path.resolve(__dirname, '../seed-data/bizplace.csv'))

    try {
      json.forEach(async (record: Object) => {
        await repository.save(record)
      })
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}

async function csvToJson(path: string) {
  return await csv()
    .preFileLine((line, index) => {
      if (index === 0) {
        return line
          .split(',')
          .map(header => _.camelCase(header))
          .join()
      } else {
        return line
      }
    })
    .fromFile(path)
}
