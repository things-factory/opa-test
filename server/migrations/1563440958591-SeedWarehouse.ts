import { Domain } from '@things-factory/shell'
import { Warehouse, Location } from '@things-factory/warehouse-base'
import path from 'path'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'
import { csvHeaderCamelizer } from '@things-factory/shell'

const seedFilePath = '../../seeds/warehouse.csv'

export class SeedWarehouse1563440958591 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {}

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
